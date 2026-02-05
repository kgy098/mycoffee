from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, LoginResponse, VerifyResponse, FindIdRequest, FindIdResponse
from app.utils.security import get_password_hash, verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user with this email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        phone_number=user.phone_number,
        birth_date=user.birth_date,
        gender=user.gender,
        signup_purpose=user.signup_purpose,
        provider=user.provider or "email",
        profile_image_url=user.profile_image_url
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=LoginResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )
    
    # Verify password
    if not user.password_hash or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다."
        )
    
    # Create access token with different expiry based on remember_me
    from app.utils.security import ACCESS_TOKEN_EXPIRE_DAYS
    if credentials.remember_me:
        access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    else:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    # Update last login
    from sqlalchemy.sql import func
    user.last_login_at = func.now()
    db.commit()
    
    return LoginResponse(
        success=True,
        token=access_token,
        token_type="bearer",
        userId=user.id,
        email=user.email,
        display_name=user.display_name
    )

@router.get("/me", response_model=VerifyResponse)
async def verify_token(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    exp_timestamp = payload.get("exp")
    exp_at = datetime.utcfromtimestamp(exp_timestamp).isoformat() if exp_timestamp else ""
    
    return VerifyResponse(
        authenticated=True,
        userId=user.id,
        email=user.email,
        display_name=user.display_name,
        expAt=exp_at,
        reason=""
    )

@router.post("/find-id", response_model=FindIdResponse)
async def find_id(request: FindIdRequest, db: Session = Depends(get_db)):
    # Find users by phone number
    users = db.query(User).filter(User.phone_number == request.phone_number).all()
    
    if not users:
        return FindIdResponse(
            success=True,
            accounts=[]
        )
    
    accounts = []
    for user in users:
        # Mask email for privacy
        email_parts = user.email.split('@')
        if len(email_parts) == 2:
            masked_email = email_parts[0][:4] + '****@' + email_parts[1]
        else:
            masked_email = user.email[:4] + '****'
        
        accounts.append({
            'id': masked_email,
            'type': user.provider or 'email',
            'typeName': {
                'email': '이메일',
                'kakao': '카카오',
                'naver': '네이버',
                'apple': 'Apple'
            }.get(user.provider or 'email', '이메일'),
            'lastLogin': user.last_login_at.strftime('%Y년 %m월 %d일') if user.last_login_at else '로그인 내역 없음'
        })
    
    return FindIdResponse(
        success=True,
        accounts=accounts
    )
