from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.db.models import DBUser

def Login(session: Session, username: str, password: str):
    userSelect = select(DBUser).where(DBUser.username == username and DBUser.password == password)
    user = session.scalars(userSelect).first()
    if (user == None):
        return None