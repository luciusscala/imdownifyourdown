import type { Metadata } from "next";
import { Jomolhari } from "next/font/google";
import "./globals.css";

const jomolhari = Jomolhari({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "A simple Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${jomolhari.className}`}>
        {children}
      </body>
    </html>
  );
}
