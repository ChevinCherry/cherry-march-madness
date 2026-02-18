from fastapi import FastAPI


app = FastAPI(title="CherryMMApi", version="1.0.0")

@app.get("/")
async def helloWorld():
    return "Hello from the Cherry March Madness API!"

@app.get("/poolData/{poolId}")
async def getPoolData(poolId: str):
    return {}
