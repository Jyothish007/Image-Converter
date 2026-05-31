import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://image-converter-007.vercel.app"),

  title: {
    default: "Image Converter",
    template: "%s | Image Converter",
  },

  description: "Convert JPG, PNG, WEBP, and BMP images online for free.",

  keywords: [
    "image converter",
    "jpg converter",
    "png converter",
    "webp converter",
    "image resize",
    "image optimization",
  ],

  openGraph: {
    title: "Image Converter",
    description: "Convert, resize, and optimize images online for free.",
    url: "https://image-converter-007.vercel.app",
    siteName: "Image Converter",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Image Converter",
    description: "Convert JPG, PNG, WEBP, and BMP images online.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
