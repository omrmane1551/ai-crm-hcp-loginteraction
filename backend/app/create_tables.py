# backend/app/create_tables.py
from .db import metadata, engine

def create_all():
    if engine is None:
        print("No engine configured in db.py")
    else:
        metadata.create_all(engine)
        print("Tables created")

if __name__ == "__main__":
    create_all()
