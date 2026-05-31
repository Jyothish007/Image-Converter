# 🖼️ Image Converter

A full-stack image conversion and optimization web application built with **Next.js** and **FastAPI**.

Users can upload images, convert them between multiple formats, resize them, adjust image quality, and apply grayscale effects directly from the browser.

## 🌐 Live Demo

**Frontend:** https://image-converter-007.vercel.app

**Backend API:** https://image-converter-2-9247.onrender.com

---

# ✨ Features

### 📤 Image Upload

* Drag & Drop support
* File picker support
* Maximum upload size: 5 MB

### 🔄 Image Format Conversion

Convert images between:

* JPEG
* PNG
* WEBP
* BMP

### 📏 Image Resizing

* Custom width
* Custom height
* Automatic aspect ratio preservation when only one dimension is provided

### 🎚️ Image Optimization

* Adjustable image quality (1–100)
* Optimized JPEG and WEBP output

### 🎨 Image Effects

* Grayscale conversion

### 📥 Download Processed Images

* Instant preview
* Download converted image directly

### 🔔 User Experience

* Toast notifications
* Loading states
* Error handling
* Responsive design

---

# 🚀 Tech Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS

## Backend

* FastAPI
* Pillow (PIL)
* Uvicorn
* Python Multipart
* SlowAPI (Rate Limiting)

## Deployment

### Frontend

* Vercel

### Backend

* Render

---

# 📌 API Endpoint

## Process Image

```http
POST /process-image
```

### Form Data

| Field         | Type    | Description          |
| ------------- | ------- | -------------------- |
| file          | File    | Image file           |
| target_format | String  | jpeg, png, webp, bmp |
| quality       | Integer | 1–100                |
| width         | Integer | Optional             |
| height        | Integer | Optional             |
| grayscale     | Boolean | true / false         |

### Response

Returns the processed image as a downloadable file.

---

# 🏗️ Project Structure

```text
Image-Converter/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── core/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/Jyothish007/Image-Converter.git
cd Image-Converter
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔒 Rate Limiting

The API uses SlowAPI rate limiting:

```text
5 requests per minute
```

per client IP.

---

# 📈 Future Improvements

* Authentication
* Batch image conversion
* Image cropping
* Drag-and-drop multiple uploads
* Image compression statistics
* Conversion history
* Dark mode
* Custom background colors for transparent PNG to JPEG conversion
* Cloud storage integration

---

# 👨‍💻 Author

**Jyothish P S**

GitHub: https://github.com/Jyothish007

---

# 📄 License

This project is open-source and available under the MIT License.
