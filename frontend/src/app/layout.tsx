import type { Metadata } from "next";
import { Playfair_Display, Syne, Syne_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--display",
  style: ["normal", "italic"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--sans",
});

const syneMono = Syne_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--mono",
});

export const metadata: Metadata = {
  title: "Aryo \u2014 Portfolio",
  description: "Solving problems across software, design, and infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${syne.variable} ${syneMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
