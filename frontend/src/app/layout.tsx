import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#800020",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://antporto.co.id"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  title: "Aryo \u2014 Portfolio",
  description: "Solving problems across software, design, and infrastructure.",
  authors: [{ name: "Rifa'i Aryo Ananta", url: "https://antporto.co.id" }],
  creator: "Rifa'i Aryo Ananta",
  publisher: "Rifa'i Aryo Ananta",
  icons: {
    icon: [
      { url: "/logo-svg.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo-svg.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://antporto.co.id",
    siteName: "Aryo Ananta — Systems Portfolio",
    title: "Aryo \u2014 Portfolio",
    description: "Solving problems across software, design, and infrastructure.",
    images: [
      {
        url: "/logo-svg.svg",
        width: 512,
        height: 512,
        alt: "Aryo Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Aryo \u2014 Portfolio",
    description: "Solving problems across software, design, and infrastructure.",
    creator: "@rfrynny",
    images: ["/logo-svg.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://antporto.co.id/#person",
      name: "Rifa'i Aryo Ananta",
      jobTitle: "Systems Architect & Software Engineer",
      url: "https://antporto.co.id",
      image: "https://antporto.co.id/logo-svg.svg",
      sameAs: [
        "https://github.com/nantaa",
        "https://linkedin.com/in/rifai-aryo-ananta",
        "https://instagram.com/rfrynny",
        "https://codepen.io/Rifai-Aryo-Ananta",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://antporto.co.id/#website",
      url: "https://antporto.co.id",
      name: "Aryo Ananta — Systems Portfolio",
      publisher: {
        "@id": "https://antporto.co.id/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${playfair.variable} ${syne.variable} ${syneMono.variable} antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo-svg.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('portfolio-theme');
                  var theme = saved === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:outline-none focus:ring-2 focus:ring-white font-mono text-xs uppercase tracking-wider shadow-lg rounded-[2px]"
        >
          Skip to content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
