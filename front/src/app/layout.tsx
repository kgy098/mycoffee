import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { suite } from "./fonts";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import GlobalLoader from "@/components/GlobalLoader";
import AutoLoginRestore from "@/components/AutoLoginRestore";
import { SpinnerGlobalLoader } from "@/components/Loader/Spinner";
import AppFrame from "@/components/AppFrame";
import 'react-responsive-modal/styles.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyCoffee.Ai",
  description: "MyCoffee.Ai",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://js.tosspayments.com/v2/payment"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${suite.variable} antialiased`}
      >
        <QueryProvider>
        <GlobalLoader>
          <SpinnerGlobalLoader />
          <AutoLoginRestore />
          {/* <ProtectedRoutes> */}
            <div className="flex flex-col">
              <AppFrame>{children}</AppFrame>
            </div>
          {/* </ProtectedRoutes> */}
          </GlobalLoader>
        </QueryProvider>
      </body>
    </html>
  );
}
