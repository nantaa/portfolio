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
  icons: {
    icon: [
      { url: "/logo-svg.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo-svg.svg",
    apple: "/logo-svg.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${syne.variable} ${syneMono.variable} antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo-svg.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo-svg.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  var theme = saved === 'light' ? 'light' : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
