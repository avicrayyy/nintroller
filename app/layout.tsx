import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { InputLogProvider } from "./components/InputLog";
import { InputLogSidebar } from "./components/InputLogSidebar";
import { ObjectivesSidebar } from "./components/ObjectivesSidebar";
import { cx, BACKGROUNDS } from "./utils";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nintroller 🎮 | NES Controller Simulator",
  description:
    "A retro-themed Nintendo (NES) controller simulator with real-time input logging and cheat code detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cx(
          geistSans.variable,
          geistMono.variable,
          pressStart.variable,
          "antialiased"
        )}
      >
        <InputLogProvider>
          <div className="retro-bg relative min-h-screen overflow-hidden font-sans text-zinc-50">
            {/* CRT overlay */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 opacity-70 ${BACKGROUNDS.crtScanlines}`}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 opacity-40 ${BACKGROUNDS.emeraldGlow}`}
            />

            {/* Layout Grid: Sidebar | Main Content | Sidebar */}
            <div className="flex min-h-screen">
              {/* Left Sidebar - Objectives */}
              <ObjectivesSidebar />

              {/* Main Content Area */}
              <div className="flex min-h-screen flex-1 flex-col lg:mx-0">
                <main className="flex flex-1 items-center justify-center">
                  <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
                    {children}
                  </div>
                </main>
              </div>

              {/* Right Sidebar - Input Log */}
              <InputLogSidebar />
            </div>
          </div>
        </InputLogProvider>
      </body>
    </html>
  );
}
