from pydantic import BaseModel


class VerifiedUserRes(BaseModel):
    email: str
    is_new_account: bool


class OTPReq(BaseModel):
    email: str


class UserSavedItemCountRes(BaseModel):
    buildings_count: int
    professions_count: int
    missions_count: int
