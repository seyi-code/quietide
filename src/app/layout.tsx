import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import { UpdateBanner } from "@/components/UpdateBanner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { NativeShell } from "@/components/NativeShell";

const SITE = "https://quietide.vercel.app";
const TITLE = "Quietide — Sleep, Focus & Calm";
const DESCRIPTION =
  "Private, offline-first sleep sounds, focus timer, breathing, and guided calm. No accounts. No cloud.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quietide",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Quietide",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Quietide" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/icons/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1A" },
    { media: "(prefers-color-scheme: light)", color: "#F1F5F9" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var raw = localStorage.getItem('quietide-storage');
                  var theme = 'dark';
                  if (raw) {
                    var parsed = JSON.parse(raw);
                    theme = (parsed.state && parsed.state.theme) || 'dark';
                  }
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.classList.remove('dark','light');
                  document.documentElement.classList.add(theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-quietide-bg antialiased">
        <ThemeProvider>
          <ServiceWorkerRegister />
          <NativeShell />
          <div className="mx-auto min-h-screen max-w-lg px-4 pb-28 pt-8">
            {children}
          </div>
          <UpdateBanner />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
