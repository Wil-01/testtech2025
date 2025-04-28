import Header from "@/components/misc/header";
import type { Metadata } from "next";
import { clash_display, inter, poppins, roboto_mono } from "./fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nextlead - Test Technique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="fr"
      className={`${poppins.variable} ${roboto_mono.variable} ${clash_display.variable} ${inter.variable}`}
    >
      <body className={`bg-background flex h-screen flex-col antialiased`}>
        <Header />
        <main className="flex h-full flex-col overflow-scroll p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
