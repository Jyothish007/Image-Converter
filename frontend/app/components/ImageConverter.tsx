"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [grayscale, setGrayscale] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const originalFormat = file?.type.split("/")[1]?.toUpperCase() || "";

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("Max file size is 5MB", "error");
      return;
    }

    setFile(selectedFile);

    setProcessedUrl(null);
    setProcessedSize(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("target_format", format);
    formData.append("quality", quality.toString());

    if (width) formData.append("width", width.toString());
    if (height) formData.append("height", height.toString());

    formData.append("grayscale", grayscale.toString());

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        showToast(error.detail, "error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessedUrl(url);
      setProcessedSize(blob.size);

      showToast("Image processed successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to connect to backend", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!file || !processedUrl) return;

    const originalName = file.name.includes(".")
      ? file.name.substring(0, file.name.lastIndexOf("."))
      : "image";

    const newFileName = `${originalName}.${format}`;

    const a = document.createElement("a");

    a.href = processedUrl;
    a.download = newFileName;
    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-200 flex flex-col items-center p-8 text-black">
      <div className="w-full max-w-2xl bg-white shadow-xl p-8 space-y-8 rounded-2xl">
        {/* Main Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-500">Image Conversion</h1>

          {file && (
            <h2 className="text-lg mt-2 text-gray-600">
              {originalFormat} → {format.toUpperCase()}
            </h2>
          )}
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            if (e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col justify-center items-center text-center hover:border-black transition"
        >
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            className="hidden"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />

          <button
            onClick={() => inputRef.current?.click()}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Choose File
          </button>

          <p className="text-sm text-gray-500 mt-2">Drag & drop image here</p>

          <p className="text-xs text-gray-400 mt-1">Max size is 5MB</p>

          {file && <p className="text-sm mt-4 text-green-600">{file.name}</p>}
        </div>

        {/* Format Selector */}
        <div>
          <label className="block font-medium mb-2">Convert To</label>

          <select
            value={format}
            disabled={!file}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="bmp">BMP</option>
          </select>
        </div>

        {/* Quality Slider */}
        <div>
          <label className="block font-medium mb-2">Quality: {quality}</label>

          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            disabled={!file}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-black disabled:cursor-not-allowed"
          />
        </div>

        {/* Resize Inputs */}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Width"
            disabled={!file}
            value={width}
            onChange={(e) =>
              setWidth(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full border border-gray-300 p-3 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            type="number"
            placeholder="Height"
            disabled={!file}
            value={height}
            onChange={(e) =>
              setHeight(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full border border-gray-300 p-3 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Grayscale */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled={!file}
              checked={grayscale}
              onChange={(e) => setGrayscale(e.target.checked)}
              className="disabled:cursor-not-allowed"
            />
            Grayscale
          </label>
        </div>

        {/* Processed Image */}
        {processedUrl && (
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Processed Image</h3>

            <Image
              src={processedUrl}
              alt="processed"
              width={200}
              height={300}
              className="w-full max-h-64 object-contain"
            />

            <div className="text-sm text-gray-600">
              <p>
                <strong>Size:</strong> {(processedSize! / 1024).toFixed(2)} KB
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Download Image
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full bg-black text-white py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Processing..." : "Convert Image"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl text-white z-50 animate-slideIn
          ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
