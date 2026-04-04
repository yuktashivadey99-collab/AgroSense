"""
Authentication routes for AgroSense
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
import jwt
from datetime import datetime, timedelta
from typing import Optional
import bcrypt

from config import settings

router = APIRouter()
security = HTTPBearer()

# Mock user database - in production, use a real database
MOCK_USERS = {
    "demo@agrosense.com": {
        "id": 1,
        "email": "demo@agrosense.com",
        "password_hash": bcrypt.hashpw("demo123".encode(), bcrypt.gensalt()).decode(),
        "name": "Demo User",
        "phone": "+1234567890"
    }
}

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    phone: str

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/signin", response_model=AuthResponse)
async def sign_in(request: SignInRequest):
    """Sign in user"""
    user = MOCK_USERS.get(request.email)
    if not user or not bcrypt.checkpw(request.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT token
    access_token = create_access_token(data={"sub": user["email"]})

    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            phone=user["phone"]
        ),
        token=access_token
    )

@router.post("/signup", response_model=AuthResponse)
async def sign_up(request: SignUpRequest):
    """Sign up new user"""
    if request.email in MOCK_USERS:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password
    password_hash = bcrypt.hashpw(request.password.encode(), bcrypt.gensalt()).decode()

    # Create new user
    user_id = len(MOCK_USERS) + 1
    new_user = {
        "id": user_id,
        "email": request.email,
        "password_hash": password_hash,
        "name": request.name,
        "phone": request.phone
    }
    MOCK_USERS[request.email] = new_user

    # Create JWT token
    access_token = create_access_token(data={"sub": request.email})

    return AuthResponse(
        user=UserResponse(
            id=user_id,
            email=request.email,
            name=request.name,
            phone=request.phone
        ),
        token=access_token
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user info"""
    payload = verify_token(credentials.credentials)
    email = payload.get("sub")

    user = MOCK_USERS.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        phone=user["phone"]
    )