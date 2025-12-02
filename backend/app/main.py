# backend/app/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .db import database, interactions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI-CRM HCP - Interactions API")

# CORS - allow frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # for testing you can use ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InteractionIn(BaseModel):
    hcp_name: str = Field(..., example="Dr. Ravi Patil")
    specialty: Optional[str] = Field(None)
    interaction_date: Optional[datetime] = Field(None)
    channel: Optional[str] = Field(None)
    notes: Optional[str] = Field(None)
    outcome: Optional[str] = Field(None)
    follow_up_required: Optional[bool] = False

class InteractionOut(InteractionIn):
    id: int
    created_at: datetime

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/interactions", response_model=InteractionOut)
async def create_interaction(payload: InteractionIn):
    data = payload.dict()
    if data.get("interaction_date") is None:
        data["interaction_date"] = datetime.utcnow()
    query = interactions.insert().values(**data)
    record_id = await database.execute(query)
    row = await database.fetch_one(interactions.select().where(interactions.c.id == record_id))
    return dict(row)

@app.get("/interactions", response_model=List[InteractionOut])
async def list_interactions():
    rows = await database.fetch_all(interactions.select().order_by(interactions.c.created_at.desc()))
    return [dict(r) for r in rows]

@app.get("/interactions/{interaction_id}", response_model=InteractionOut)
async def get_interaction(interaction_id: int):
    row = await database.fetch_one(interactions.select().where(interactions.c.id == interaction_id))
    if not row:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return dict(row)
