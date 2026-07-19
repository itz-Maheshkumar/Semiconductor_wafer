from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserOut
from app.core.jwt import create_access_token
from app.core.password import hash_password, verify_password
from app.api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class UserUpdateRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    password: str | None = None


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(payload: SignupRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"error": {"code": "EMAIL_EXISTS", "message": "Email already registered."}},
        )

    user = User(email=payload.email, password=hash_password(payload.password), name=payload.name)
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(user.id)
    return AuthResponse(user=UserOut(**user.model_dump()), token=token)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()

    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect."}},
        )

    token = create_access_token(user.id)
    return AuthResponse(user=UserOut(**user.model_dump()), token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(**current_user.model_dump())


@router.put("/me", response_model=UserOut)
def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Update current user's profile"""
    if payload.email:
        # Check if email is already taken
        existing = session.exec(
            select(User).where(User.email == payload.email)
        ).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(
                status_code=409,
                detail={"error": {"code": "EMAIL_EXISTS", "message": "Email already in use."}},
            )
        current_user.email = payload.email

    if payload.name:
        current_user.name = payload.name

    if payload.password:
        current_user.password = hash_password(payload.password)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return UserOut(**current_user.model_dump())