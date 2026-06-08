from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.config import TRUSTED_HOSTS, is_insecure_secret
from app.core.security_middleware import RateLimitMiddleware, SecurityHeadersMiddleware
from app.database import Base, engine
from app.routes import auth, donation

app = FastAPI(title="SurplusLink API", version="1.0.0")

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=120, window_seconds=60)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=TRUSTED_HOSTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(donation.router)


@app.get("/")
def root():
    return {
        "name": "SurplusLink API",
        "database_connected": True,
        "security": {
            "headers": True,
            "rate_limiting": True,
            "rbac": True,
            "trusted_hosts": TRUSTED_HOSTS,
            "secret_warning": is_insecure_secret(),
        },
        "modules": ["auth", "donations", "websocket-ready", "surplus-ai-ready"],
    }
