import type { Metadata } from "next";
import type { ReactNode } from "react";

// Placeholder from BE-01. The Interface chat replaces this with the app shell (INT-01).
export const metadata: Metadata = {
  title: "Collectibles platform",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
