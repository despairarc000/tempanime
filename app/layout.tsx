import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loxada Anime",
  description: "Anime application foundation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
