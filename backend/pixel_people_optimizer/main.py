import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api_router
from .auth import auth_router, get_current_user_id

load_dotenv()

app = FastAPI(title="Pixel People Optimizer API")

origins = [os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "Welcome to Pixel People Optimizer API"}


@app.get("/protected")
def protected_route(user_id: str = Depends(get_current_user_id)):
    return {"message": f"Hello user {user_id}, this is protected!"}
