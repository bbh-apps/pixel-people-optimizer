import json
import os
from typing import Optional

import jwt
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from gotrue import User
from jose import JWTError
from jose import jwt as jose_jwt
from jose.utils import base64url_decode
from supabase import create_client

from .schema import VerifiedUserRes

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")

if (
    not SUPABASE_URL
    or not SUPABASE_ANON_KEY
    or not SUPABASE_SERVICE_ROLE_KEY
    or not SUPABASE_JWKS_URL
):
    raise RuntimeError("Missing Supabase credentials in .env")

# Service role client - for inserts that need bypassing RLS
supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# User client - for normal auth/session use
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
auth_scheme = HTTPBearer()
auth_router = APIRouter(prefix="/auth", tags=["auth"])


def decode_jwt_header(token):
    headers_segment = token.split(".")[0]
    decoded_bytes = base64url_decode(headers_segment.encode())
    return json.loads(decoded_bytes)


def get_jwks():
    response = requests.get(SUPABASE_JWKS_URL)
    response.raise_for_status()
    return response.json()["keys"]


def get_public_key(jwks: dict, kid):
    for key in jwks:
        if key["kid"] == kid:
            return key
    raise Exception("Public key not found.")


def verify_supabase_jwt(token: str, jwks: dict, audience: str | None = None):
    header = jwt.get_unverified_header(token)
    jwks = get_jwks()
    public_key = get_public_key(jwks, header["kid"])
    return jose_jwt.decode(
        token,
        public_key,
        algorithms=[public_key["alg"]],
        audience=audience,
        options={"verify_aud": audience is not None},
    )


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
) -> str:
    token = credentials.credentials
    try:
        jwks = get_jwks()
        payload = verify_supabase_jwt(token, jwks)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Missing user ID in token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


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
