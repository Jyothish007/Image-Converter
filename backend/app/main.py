from fastapi import FastAPI
from app.api.routes import image

app = FastAPI()

app.include_router(image.router)