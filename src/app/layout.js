import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Novel Solutions - Premium B2B Manufacturing Solutions | GeM Certified",
  description: "Novel Solutions is a GeM-registered B2B e-commerce platform offering high-quality manufacturing products at consistent prices. Trusted by businesses across India for furniture, electronics, safety items, and more.",
  keywords: "B2B manufacturing, industrial products, GeM vendor, manufacturing supplies, office furniture, safety equipment, electronic items, clinical supplies, bulk orders, wholesale",
  authors: [{ name: "Novel Solutions" }],
  creator: "Novel Solutions",
  publisher: "Novel Solutions",
  robots: "index, follow",
  image: "/images/companylogo.jpg",
  metadataBase: new URL('https://novelsolutions.com'), // Update with your actual domain
  openGraph: {
    title: "Novel Solutions - Premium B2B Manufacturing Solutions",
    description: "GeM-certified B2B manufacturer delivering high-quality products at consistent prices. Trusted by 500+ businesses across India.",
    url: "https://novelsolutions.com", // Update with your actual domain
    siteName: "Novel Solutions",
    images: [
      {
        url: "/images/companylogo.jpg",
        width: 1200,
        height: 630,
        alt: "Novel Solutions - B2B Manufacturing"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Novel Solutions - Premium B2B Manufacturing Solutions",
    description: "GeM-certified B2B manufacturer delivering high-quality products at consistent prices",
    images: ["/images/companylogo.jpg"]
  },
  verification: {
    google: "your-google-verification-code-here", // Replace with actual code from Google Search Console
    // yandex: "your-yandex-code",
    // bing: "your-bing-code"
  }
};

export default function RootLayout({ children }) {
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
