import os

from dotenv import load_dotenv
from supabase import create_client

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
