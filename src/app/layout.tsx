import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Manrope,
} from "next/font/google";
import type { ReactNode } from "react";

import "./tokens.css";
import "./globals.css";

const headingFont = Manrope({
  subsets: ["latin"],
  variable: "--font-heading-family",
  weight: ["600", "700", "800"],
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body-family",
  weight: ["400", "500", "600"],
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-family",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Online Examination Assessment System",
  description: "Route skeleton and shared application entry structure.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      >
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
