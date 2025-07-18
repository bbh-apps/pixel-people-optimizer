import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from gotrue import User
from supabase import create_client

from backend.pixel_people_optimizer.schema import OTPReq

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing Supabase credentials in .env")

# Service role client - for inserts that need bypassing RLS
supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# User client - for normal auth/session use
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
auth_scheme = HTTPBearer()
auth_router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
) -> str:
    token = credentials.credentials
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user.user.id


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
) -> User:
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(jwt=token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user.user


@auth_router.post("/me")
def me(auth_user: User = Depends(get_current_user)):
    user_id = auth_user.id
    email = auth_user.email

    # Check if user already exists in your `users` table
    existing_user = (
        supabase_admin.table("users").select("*").eq("id", user_id).execute()
    )

    if not existing_user.data:
        # Create new user record in your custom `users` table
        supabase_admin.table("users").insert({"id": user_id, "email": email}).execute()

    return {"user": {"email": email}}
