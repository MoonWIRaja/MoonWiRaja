import "./globals.css";

export const metadata = {
  title: "MoonWiRaja | Console Portfolio",
  description:
    "Portfolio interaktif MoonWiRaja dalam bentuk konsol & dashboard moden dengan integrasi GitHub API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
