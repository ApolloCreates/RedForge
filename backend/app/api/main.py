from dataclasses import asdict
from uuid import uuid4

from fastapi import BackgroundTasks, FastAPI, HTTPException
from pydantic import BaseModel

from app.engine import RedTeamEngine
from app.reporting.report import SecurityReport
from fastapi.middleware.cors import CORSMiddleware

import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.database.models import Scan

app = FastAPI(
    title="RedForge API",
    description="Automated LLM Security Testing API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class ScanRequest(BaseModel):

    categories: list[str] | None = None
    max_attempts_per_strategy: int = 2


def run_scan(
    scan_id: str,
    request: ScanRequest,
):

    db = SessionLocal()

    scan = db.get(Scan, scan_id)

    if scan is None:
        db.close()
        return

    scan.status = "running"
    db.commit()

    def progress_callback(
        completed,
        total,
        category,
        strategy,
    ):

        progress = (
            completed / total * 100
            if total
            else 0
        )

        scan = db.get(Scan, scan_id)

        if scan is None:
            return

        scan.progress = round(progress)
        scan.completed_attempts = completed
        scan.total_attempts = total
        scan.current_category = category
        scan.current_strategy = strategy

        db.commit()

    try:

        engine = RedTeamEngine(
            progress_callback=progress_callback
        )

        results = engine.run_scan(
            categories=request.categories,
            max_attempts_per_strategy=(
                request.max_attempts_per_strategy
            ),
        )

        report = SecurityReport(results)
        data = report.generate()

        scan = db.get(Scan, scan_id)

        scan.status = "completed"
        scan.progress = 100
        serializable_data = {
            **data,
            "findings": [
                asdict(finding)
                for finding in data["findings"]
            ],
        }

        scan.report = json.dumps(
            serializable_data
        )
        scan.completed_at = datetime.now(
            timezone.utc
        )

        db.commit()

    except Exception as exc:

        scan = db.get(Scan, scan_id)

        if scan:
            scan.status = "failed"
            scan.error = str(exc)
            db.commit()

    finally:

        db.close()
        
        
        
@app.get("/")
def root():

    return {
        "name": "RedForge",
        "version": "0.1.0",
        "status": "online",
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/api/scans")
def create_scan(
    request: ScanRequest,
    background_tasks: BackgroundTasks,
):

    scan_id = str(uuid4())

    db: Session = SessionLocal()

    scan = Scan(
        id=scan_id,
        status="queued",
        progress=0,
        completed_attempts=0,
        total_attempts=0,
    )

    db.add(scan)
    db.commit()
    db.close()

    background_tasks.add_task(
        run_scan,
        scan_id,
        request,
    )

    return {
        "scan_id": scan_id,
        "status": "queued",
    }

@app.get("/api/scans/{scan_id}")
def get_scan(scan_id: str):

    db = SessionLocal()

    scan = db.get(
        Scan,
        scan_id
    )

    if scan is None:

        db.close()

        raise HTTPException(
            status_code=404,
            detail="Scan not found",
        )

    result = {
        "id": scan.id,
        "status": scan.status,
        "progress": scan.progress,
        "completed_attempts": (
            scan.completed_attempts
        ),
        "total_attempts": scan.total_attempts,
        "current_category": (
            scan.current_category
        ),
        "current_strategy": (
            scan.current_strategy
        ),
        "report": (
            json.loads(scan.report)
            if scan.report
            else None
        ),
        "error": scan.error,
    }

    db.close()

    return result

@app.get("/api/scans")
def list_scans():

    db = SessionLocal()

    scans = (
        db.query(Scan)
        .order_by(Scan.created_at.desc())
        .all()
    )

    result = []

    for scan in scans:

        result.append({
            "id": scan.id,
            "status": scan.status,
            "progress": scan.progress,
            "completed_attempts": (
                scan.completed_attempts
            ),
            "total_attempts": (
                scan.total_attempts
            ),
            "created_at": (
                scan.created_at.replace(
                    tzinfo=timezone.utc
                ).isoformat()
                if scan.created_at
                else None
            ),
            "completed_at": (
                scan.completed_at.replace(
                    tzinfo=timezone.utc
                ).isoformat()
                if scan.completed_at
                else None
            ),
        })

    db.close()

    return {
        "scans": result
    }