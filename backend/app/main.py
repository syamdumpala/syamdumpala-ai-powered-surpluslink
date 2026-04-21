from fastapi import FastAPI
from app.database import engine, Base
from app.routes import auth

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(auth.router)


@app.get("/")
def root():
    return {"database_connected": True}