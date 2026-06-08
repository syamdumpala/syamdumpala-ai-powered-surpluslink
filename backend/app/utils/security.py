from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def validate_password_strength(password: str):
    checks = [
        (len(password) >= 8, "Password must be at least 8 characters long"),
        (any(char.isupper() for char in password), "Password must include an uppercase letter"),
        (any(char.islower() for char in password), "Password must include a lowercase letter"),
        (any(char.isdigit() for char in password), "Password must include a number"),
    ]

    for passed, message in checks:
        if not passed:
            return message

    return None


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str):
    try:
      return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
      return None
