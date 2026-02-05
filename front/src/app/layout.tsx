import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { suite } from "./fonts";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import GlobalLoader from "@/components/GlobalLoader";
import { SpinnerGlobalLoader } from "@/components/Loader/Spinner";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${suite.variable} antialiased`}
      >
        <QueryProvider>
        <GlobalLoader>
          <SpinnerGlobalLoader />
          {/* <ProtectedRoutes> */}
            <div className="flex flex-col">
              <div className="w-full min-h-[100dvh] sm:max-w-sm sm:mx-auto bg-background">
                {children}
              </div>
            </div>
          {/* </ProtectedRoutes> */}
          </GlobalLoader>
        </QueryProvider>
      </body>
    </html>
  );
}
