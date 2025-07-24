import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from gotrue import User
from pixel_people_optimizer.auth.service import get_current_user
from pixel_people_optimizer.users.schema import VerifiedUserRes
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/me", response_model=VerifiedUserRes)
def me(auth_user: User = Depends(get_current_user)):
    user_id = auth_user.id
    email = auth_user.email

    # Check if user already exists in your `users` table
    existing_user = (
        supabase_admin.table("users").select("*").eq("id", user_id).execute()
    )

    is_new_account = not existing_user.data
    if is_new_account:
        # Create new user record in your custom `users` table
        supabase_admin.table("users").insert({"id": user_id, "email": email}).execute()

    return {"email": email, "is_new_account": is_new_account}
