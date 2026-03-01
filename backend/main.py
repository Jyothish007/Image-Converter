from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps
import io

app = FastAPI()

# Formats
ALLOWED_FORMATS = ["jpeg", "jpg", "png", "webp", "bmp"]

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    target_format: str = Form("jpeg"),
    quality: int = Form(80),
    width: int = Form(None),
    height: int = Form(None),

    grayscale: bool = Form(False),
    # crop_x: int = Form(None),
    # crop_y: int = Form(None),
    # crop_width: int = Form(None),
    # crop_height: int = Form(None),
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Read file into memory
        file_bytes = await file.read()

        # Validate file size
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size must be less than 5MB"
            )

        # Format validation
        target_format = target_format.lower()
        if target_format not in ALLOWED_FORMATS:
            raise HTTPException(status_code=400, detail="Unsupported format")

        # Quality validation
        if not (1 <= quality <= 100):
            raise HTTPException(
                status_code=400,
                detail="Quality must be between 1 and 100"
            )

        # Opening image from memory
        image = Image.open(io.BytesIO(file_bytes))

        # Auto-rotate based on EXIF (mobile fix)
        image = ImageOps.exif_transpose(image)

        # Crop
        # if all(v is not None for v in [crop_x, crop_y, crop_width, crop_height]):
        #     image = image.crop((
        #         crop_x,
        #         crop_y,
        #         crop_x + crop_width,
        #         crop_y + crop_height
        #     ))

        # Aspect Ratio Resize
        if width and not height:
            ratio = width / float(image.width)
            height = int(image.height * ratio)

        elif height and not width:
            ratio = height / float(image.height)
            width = int(image.width * ratio)

        if width and height:
            image = image.resize((width, height))

        # Grayscale
        if grayscale:
            image = image.convert("L")

        # Fix transparency for JPEG
        if target_format in ["jpg", "jpeg"] and image.mode in ["RGBA", "P", "LA"]:
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background

        # Save to memory
        img_io = io.BytesIO()

        # Format-specific saving
        if target_format == "jpeg" or target_format == "jpg":
            image.save(
                img_io,
                format="JPEG",
                quality=quality,
                optimize=True
            )

        elif target_format == "webp":
            image.save(
                img_io,
                format="WEBP",
                quality=quality,
                method=6
            )

        elif target_format == "png":
            image.save(
                img_io,
                format="PNG",
                compress_level=9
            )

        elif target_format == "bmp":
            image.save(
                img_io,
                format="BMP"
            )

        img_io.seek(0)

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
