import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
