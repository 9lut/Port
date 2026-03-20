import type { Metadata } from "next";
import { JetBrains_Mono, Anuphan } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
import SessionProvider from "@/components/SessionProvider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lutfee | Portfolio",
  description: "Lutfee | Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${anuphan.variable} antialiased`}
      >
        <SessionProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
