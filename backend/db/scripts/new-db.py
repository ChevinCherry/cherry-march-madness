from db.driver import DBDriver
from db.models import Base
from dotenv import load_dotenv

if (load_dotenv() == False):
    raise "No .env file was found for setting environment variables"
engine = DBDriver.getEngine()
Base.metadata.create_all(bind=engine)