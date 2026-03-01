"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [grayscale, setGrayscale] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const originalFormat = file?.type.split("/")[1]?.toUpperCase() || "";

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Max file size is 5MB");
      return;
    }
    setFile(selectedFile);
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

    const res = await fetch("http://127.0.0.1:8000/process-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.detail);
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `processed.${format}`;
    a.click();

    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-200 flex flex-col items-center p-8 text-black">
      <div className="w-full max-w-2xl bg-white shadow-xl p-8 space-y-8">
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full bg-black text-white py-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Processing..." : "Convert Image"}
        </button>
      </div>
    </main>
  );
}
