# 🖼️ Image Compression & Converter API

A backend image processing API built with **FastAPI** and **Pillow** that allows:

- Image compression
- Image resizing
- Image format conversion
- JPEG transparency handling

Frontend (Next.js) will be added later to interact with this API.

---

# 🚀 Tech Stack

- Python 3.10+
- FastAPI
- Uvicorn
- Pillow (PIL)
- python-multipart (for file uploads)

---

📌 What This Project Does
1️⃣ Image Compression Endpoint

POST /compress

Features:

- Resize image (optional)
- Adjust quality (JPEG/WebP)
- Convert format while compressing
- Handles transparency for JPEG

2️⃣ Image Conversion Endpoint

POST /convert

Features:

- Convert image to another format
- Supports: jpeg, jpg, png, webp, bmp
- Automatically removes transparency when converting to JPEG
- Validates file type

---

# 🔜 To Do Next

Add File Size Limit

- Prevent very large uploads.

Add Background Color Option for JPEG

- Replace transparency with white instead of black.

Add Logging

- Log requests and errors.

Add Rate Limiting

- Protect API from abuse.

Connect Frontend (Next.js)

- Create UI with:
  - Drag & Drop upload
  - Format selector
  - Compression slider
  - Download button
