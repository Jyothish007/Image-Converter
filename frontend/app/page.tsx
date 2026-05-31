import ImageConverter from "./components/ImageConverter";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Image Converter",
  description: "Convert JPG, PNG, WEBP, and BMP images online for free.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ImageConverter />
    </>
  );
}
