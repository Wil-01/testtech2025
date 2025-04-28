import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
});

export const clash_display = localFont({
  src: [
    {
      path: "./clash-display/ClashDisplay-Extralight.woff2",
      weight: "100",
      style: "thin",
    },
    {
      path: "./clash-display/ClashDisplay-Light.woff2",
      weight: "300",
      style: "light",
    },
    {
      path: "./clash-display/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "regular",
    },
    {
      path: "./clash-display/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "./clash-display/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "semibold",
    },
    {
      path: "./clash-display/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
  preload: true,
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
  preload: true,
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});