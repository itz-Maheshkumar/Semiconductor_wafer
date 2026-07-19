from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserOut
from app.core.jwt import create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(payload: SignupRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={"error": {"code": "EMAIL_EXISTS", "message": "Email already registered."}},
        )

    user = User(email=payload.email, password=payload.password, name=payload.name)
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(user.id)
    return AuthResponse(user=UserOut(**user.model_dump()), token=token)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()

    if not user or user.password != payload.password:
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect."}},
        )

    token = create_access_token(user.id)
    return AuthResponse(user=UserOut(**user.model_dump()), token=token)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut(**current_user.model_dump())