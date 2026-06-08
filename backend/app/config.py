import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surpluslink.db")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-this-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
TRUSTED_HOSTS = [
    host.strip()
    for host in os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1,*.onrender.com").split(",")
    if host.strip()
]


def is_insecure_secret() -> bool:
    return SECRET_KEY in {"fallback_secret", "supersecretkey", "dev-only-change-this-secret"} or len(SECRET_KEY) < 32
