import os
from pathlib import Path
from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import Session

class DBDriver:
    __engine: Engine | None = None

    @classmethod
    def getEngine(cls) -> Engine:
        if (cls.__engine == None):
            cls.__engine = create_engine(f"sqlite:///{Path(f"{os.getenv("DB_PATH")}/cherrymm.db").resolve()}")
        return cls.__engine
    
    @classmethod
    def startSession(cls) -> Session:
        return Session(cls.getEngine())