import type { Metadata } from "next";
import { Noto_Serif, Work_Sans } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sable-app.tech"),
  title: "Sable — Write with Intention",
  description:
    "Sable is a beautiful, local-first writing app that keeps your words private, your focus sharp, and your creativity flowing.",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Sable — Write with Intention",
    description: "A beautiful, local-first writing app.",
    siteName: "Sable",
  },
  twitter: {
    card: "summary_large_image",
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
      className={`${notoSerif.variable} ${workSans.variable} dark`}
    >
      <body>{children}</body>
    </html>
  );
}
