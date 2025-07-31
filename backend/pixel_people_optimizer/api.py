from fastapi import APIRouter

from .buildings.api import router as buildings_router
from .missions.api import router as missions_router
from .professions.api import router as professions_router
from .recommendations.api import router as recommendations_router

api_router = APIRouter(prefix="/api", tags=["api"])
api_router.include_router(buildings_router)
api_router.include_router(missions_router)
api_router.include_router(professions_router)
api_router.include_router(recommendations_router)
