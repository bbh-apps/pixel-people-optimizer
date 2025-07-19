import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api_router
from .auth import auth_router

load_dotenv()

app = FastAPI(title="Pixel People Optimizer API")

CORS_REGEX = os.getenv("CORS_REGEX")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=CORS_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "Welcome to Pixel People Optimizer API"}
