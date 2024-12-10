import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui-components/Navbar";
import { AuthContextProvider } from "../context/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User | Management System App",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <div className="flex w-full h-screen">
            <div className="overflow-y-auto   w-full min-h-screen">
              <Navbar />
              <div className="rounded-lg h-full bg-white">{children}</div>
            </div>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
