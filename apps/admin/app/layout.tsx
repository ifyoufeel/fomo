import type { Metadata } from "next";
import type { ReactNode } from "react";

// Placeholder from BE-01. The Admin & content chat sets up Payload here.
export const metadata: Metadata = {
  title: "Collectibles admin",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
