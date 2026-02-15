from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI()

# Allow frontend to connect
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change to frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Allowed output formats
ALLOWED_FORMATS = ["jpeg", "jpg", "png", "webp", "bmp"]


@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    target_format: str = Form("jpeg"),
    quality: int = Form(80),
    width: int = Form(None),
    height: int = Form(None),
):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Validate format
        target_format = target_format.lower()

        if target_format not in ALLOWED_FORMATS:
            raise HTTPException(status_code=400, detail="Unsupported format")

        # Validate quality
        if not (1 <= quality <= 100):
            raise HTTPException(status_code=400, detail="Quality must be between 1 and 100")

        # Open Image
        image = Image.open(file.file)

        # JPEG does NOT support transparency (alpha channel).
        if target_format in ["jpg", "jpeg"] and image.mode in ["RGBA", "P", "LA"]:
            image = image.convert("RGB")

        # Resize (Optional)
        if width is not None and height is not None:
            image = image.resize((width, height))

        # Save to memory
        img_io = io.BytesIO()

        if target_format in ["jpeg", "jpg", "webp"]:
            image.save(
                img_io,
                format=target_format.upper(),
                quality=quality,
                optimize=True
            )
        else:
            image.save(
                img_io,
                format=target_format.upper()
            )

        img_io.seek(0)

        # Return streaming response
        return StreamingResponse(
            img_io,
            media_type=f"image/{target_format}",
            headers={
                "Content-Disposition": f"attachment; filename=processed.{target_format}"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/")
def root():
    return {"message": "Image processing API is running 🚀"}
