# backend/run.py

import nest_asyncio
import uvicorn

from main import app

nest_asyncio.apply()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
