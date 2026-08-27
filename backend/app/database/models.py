from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Scan(Base):

    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
    )

    status: Mapped[str] = mapped_column(
        String,
        default="queued",
    )

    progress: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    completed_attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    total_attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    current_category: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    current_strategy: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    report: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    error: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )