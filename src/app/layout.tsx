import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Nav from "../components/Nav";
import PageFooter from "../components/PageFooter";

export const metadata: Metadata = {
  title: "Music4You",
  description: "Rate your favourite Music!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
          <PageFooter />
        </Providers>
      </body>
    </html>
  );
}
