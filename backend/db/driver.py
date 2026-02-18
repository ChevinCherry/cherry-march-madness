import os
from sqlalchemy import create_engine, Engine

class DBDriver:
    engine: Engine
    def getEngine():
        if (DBDriver.engine == None):
            DBDriver.engine = create_engine(f"sqlite:///{os.getenv("DB_PATH")}")
        return DBDriver.engine