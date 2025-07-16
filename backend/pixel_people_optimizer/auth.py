import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase credentials in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
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


@auth_router.post("/anonymous")
def anonymous_login():
    result = supabase.auth.sign_in_anonymous()
    if not result.session:
        raise HTTPException(status_code=500, detail="Anonymous login failed")
    return {"access_token": result.session.access_token, "user": result.user}


@auth_router.post("/otp")
def start_email_otp(email: str):
    response = supabase.auth.sign_in_with_otp(
        {
            "email": email,
            "options": {
                "email_redirect_to": FRONTEND_ORIGIN,
            },
        }
    )
    if response is None:
        raise HTTPException(status_code=500, detail="OTP login failed")
    return {"message": "OTP sent to email"}


@auth_router.post("/verify")
def verify_otp(email: str, token: str):
    result = supabase.auth.verify_otp(
        {"email": email, "token": token, "type": "magiclink"}
    )
    if not result.session:
        raise HTTPException(status_code=400, detail="OTP verification failed")
    return {"access_token": result.session.access_token, "user": result.user}
