# backend/app/db.py
import os
from dotenv import load_dotenv
from databases import Database
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime, Boolean, create_engine
from sqlalchemy.sql import func

# load .env located at backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in backend/.env")

# async DB (uses aiomysql)
database = Database(DATABASE_URL)
metadata = MetaData()

interactions = Table(
    "interactions",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("hcp_name", String(255), nullable=False),
    Column("specialty", String(150), nullable=True),
    Column("interaction_date", DateTime, nullable=False, server_default=func.now()),
    Column("channel", String(100), nullable=True),
    Column("notes", Text, nullable=True),
    Column("outcome", String(255), nullable=True),
    Column("follow_up_required", Boolean, nullable=False, server_default="false"),
    Column("created_at", DateTime, server_default=func.now()),
)

# sync engine for create_all: replace async driver with sync driver (aiomysql -> pymysql)
sync_database_url = DATABASE_URL.replace("+aiomysql", "+pymysql")
engine = create_engine(sync_database_url, echo=False)
 
