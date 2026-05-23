import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

_raw_url = os.getenv("DATABASE_URL", "sqlite:///./mehra_travels.db")

# Render / Heroku give "postgres://" — SQLAlchemy requires "postgresql://"
DATABASE_URL = _raw_url.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False; PostgreSQL doesn't accept that arg
_is_sqlite = DATABASE_URL.startswith("sqlite")
_connect_args = {"check_same_thread": False} if _is_sqlite else {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
