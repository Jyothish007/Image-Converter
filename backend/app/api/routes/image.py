from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from app.services.image_service import MAX_FILE_SIZE, ALLOWED_FORMATS
from fastapi.responses import StreamingResponse
from app.core.limiter import limiter
from PIL import Image, ImageOps
import io

router = APIRouter()

@router.post("/process-image")
@limiter.limit("5/minute")
async def process_image(
    request: Request,  # ⚠️ REQUIRED for limiter
    file: UploadFile = File(...),
    target_format: str = Form("jpeg"),
    quality: int = Form(80),
    width: int = Form(None),
    height: int = Form(None),
    grayscale: bool = Form(False),
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        file_bytes = await file.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size must be less than 5MB"
            )

        target_format = target_format.lower()
        if target_format not in ALLOWED_FORMATS:
            raise HTTPException(status_code=400, detail="Unsupported format")

        if not (1 <= quality <= 100):
            raise HTTPException(
                status_code=400,
                detail="Quality must be between 1 and 100"
            )

        image = Image.open(io.BytesIO(file_bytes))

        # EXIF fix
        image = ImageOps.exif_transpose(image)

        # Resize
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

        # Fix transparency
        if target_format in ["jpg", "jpeg"] and image.mode in ["RGBA", "P", "LA"]:
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background

        img_io = io.BytesIO()

        # Format-specific saving
        if target_format in ["jpeg", "jpg"]:
            image.save(img_io, format="JPEG", quality=quality, optimize=True)

        elif target_format == "webp":
            image.save(img_io, format="WEBP", quality=quality, method=6)

        elif target_format == "png":
            image.save(img_io, format="PNG", compress_level=9)

        elif target_format == "bmp":
            image.save(img_io, format="BMP")

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
