"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [grayscale, setGrayscale] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_format", format);
    formData.append("quality", quality.toString());

    if (width) formData.append("width", width.toString());
    if (height) formData.append("height", height.toString());

    formData.append("grayscale", grayscale.toString());

    setLoading(true);

    try {
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
    } catch (err) {
      alert("Something went wrong");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-10 gap-6">
      <h1 className="text-3xl font-bold">Image Processor</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border"
      />

      <div>
        <label>Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WEBP</option>
          <option value="bmp">BMP</option>
        </select>
      </div>

      <div>
        <label>Quality (1-100):</label>
        <input
          type="number"
          value={quality}
          min={1}
          max={100}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="border p-2 ml-2 w-20"
        />
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Width"
          value={width}
          onChange={(e) =>
            setWidth(e.target.value ? Number(e.target.value) : "")
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Height"
          value={height}
          onChange={(e) =>
            setHeight(e.target.value ? Number(e.target.value) : "")
          }
          className="border p-2"
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={grayscale}
            onChange={(e) => setGrayscale(e.target.checked)}
            className="mr-2"
          />
          Grayscale
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Process Image"}
      </button>
    </main>
  );
}
