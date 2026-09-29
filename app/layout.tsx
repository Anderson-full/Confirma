import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentoria Comunique - RSVP",
  description: "Confirme a sua presença na próxima mentoria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
