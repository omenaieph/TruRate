import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://truerate.app"),
  title: {
    default: "TruRate | Universal Professional Rate Modeler",
    template: "%s | TruRate"
  },
  description: "Institutional-grade hourly rate calculator for consultants, lawyers, and specialized professionals. Optimize your income architecture with mathematical precision.",
  keywords: ["rate calculator", "consultant pricing", "freelance rate modeler", "hourly rate math", "professional services pricing", "income optimization"],
  authors: [{ name: "TruRate Financial" }],
  creator: "TruRate",
  publisher: "TruRate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TruRate | Universal Rate Modeler",
    description: "World-class financial modeling for high-stakes professionals.",
    url: "https://truerate.app",
    siteName: "TruRate",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
