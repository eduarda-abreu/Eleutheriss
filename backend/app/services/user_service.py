from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user_schema import UserCreate, LoginData
from app.core.security import get_password_hash, verify_password, create_access_token


class UserService:

    def find_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    def register(self, db: Session, data: UserCreate):
        existing_user = self.find_by_email(db, data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already registered."
            )

        hashed_password = get_password_hash(data.password)

        new_user = User(
            name=data.name,
            email=data.email.lower(),
            pwd_hash=hashed_password
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    def login(self, db: Session, data: LoginData):
        user = self.find_by_email(db, data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )

        if not verify_password(data.password, user.pwd_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )

        token = create_access_token({"sub": str(user.id)})

        return {"access_token": token, "token_type": "bearer"}


user_service = UserService()