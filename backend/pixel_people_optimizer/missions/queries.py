from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from sqlalchemy.orm import Session


def get_user_completed_missions(user_id: int, db: Session):
    return (
        db.query(SpecialMission)
        .join(MySpecialMission, SpecialMission.id == MySpecialMission.mission_id)
        .filter(MySpecialMission.user_id == user_id)
        .subquery()
    )
