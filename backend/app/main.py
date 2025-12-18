from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import get_settings
from .database import Base, engine
from .routers import auth, users, questions, categories, stats


settings = get_settings()

app = FastAPI(title=settings.app_name, openapi_url=f"{settings.api_prefix}/openapi.json")

# CORS
# - development: allow all (easy local dev)
# - production: restrict to configured origins
allow_origins = ["*"] if settings.environment.lower() == "development" else settings.cors_origin_list
allow_credentials = False if allow_origins == ["*"] else True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    # Ensure tables exist (for SQLite/local dev)
    Base.metadata.create_all(bind=engine)


# Routers
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(users.router, prefix=settings.api_prefix)
app.include_router(questions.router, prefix=settings.api_prefix)
app.include_router(categories.router, prefix=settings.api_prefix)
app.include_router(stats.router, prefix=settings.api_prefix)


@app.get("/")
def read_root():
    return {"status": "ok"}


def create_app():
    return app

