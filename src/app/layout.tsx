import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper } from "@/components/providers/AuthProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Splitora - Split Subscription Costs",
  description: "Manage and split shared subscription costs with friends, roommates, or coworkers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
