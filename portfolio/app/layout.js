import "./globals.css";

export const metadata = {
  title: "MoonWiRaja | Console Portfolio",
  description:
    "Interactive portfolio of MoonWiRaja — a console & modern dashboard with GitHub API integration.",
  icons: {
    icon: "https://github.com/MoonWIRaja.png",
    apple: "https://github.com/MoonWIRaja.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
