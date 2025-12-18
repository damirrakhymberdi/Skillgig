from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.engine import Engine


def _sqlite_has_column(conn, table: str, column: str) -> bool:
    rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
    # sqlite PRAGMA table_info columns: cid, name, type, notnull, dflt_value, pk
    return any(row[1] == column for row in rows)


def run_startup_migrations(engine: Engine) -> None:
    """
    Lightweight, idempotent migrations for local SQLite setups.

    Note: SQLAlchemy `create_all()` won't add new columns to existing tables.
    """
    if engine.dialect.name != "sqlite":
        return

    with engine.begin() as conn:
        # Questions: support separate code example field.
        if not _sqlite_has_column(conn, "questions", "code_example"):
            conn.execute(text("ALTER TABLE questions ADD COLUMN code_example TEXT"))

        # Answers already have this in most DBs, but keep it safe/idempotent.
        if not _sqlite_has_column(conn, "answers", "code_example"):
            conn.execute(text("ALTER TABLE answers ADD COLUMN code_example TEXT"))


