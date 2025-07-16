from fastapi import Depends, HTTPException, Request
from jose import jwt

SUPABASE_JWT_SECRET = "your-supabase-jwt-secret"  # found in Supabase → Project Settings → Auth → JWT Secret


def get_current_user_id(request: Request) -> str:
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
