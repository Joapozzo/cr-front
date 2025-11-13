import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "react-hot-toast";

// Configuración de Mulish con todos los pesos
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mulish",
  display: "swap",
});

// Configuración completa de SEO
export const metadata: Metadata = {
  title: {
    template: "%s | Copa Relámpago",
    default: "Copa Relámpago | El Mejor Torneo de Fútbol 7 de Córdoba",
  },
  description: "Copa Relámpago es el torneo de fútbol 7 más importante de Córdoba. Categorías para todas las edades, competencias profesionales y la mejor experiencia futbolística.",
  keywords: [
    "copa relampago",
    "futbol 7",
    "torneo futbol",
    "cordoba",
    "futbol cordoba",
    "competencias deportivas",
    "equipos futbol",
    "categorias futbol",
    "liga futbol"
  ],
  authors: [{ name: "Copa Relámpago" }],
  creator: "Copa Relámpago",
  publisher: "Copa Relámpago",

  // Configuración de robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph para redes sociales
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://coparelampago.com",
    siteName: "Copa Relámpago",
    title: "Copa Relámpago | El Mejor Torneo de Fútbol 7 de Córdoba",
    description: "Copa Relámpago es el torneo de fútbol 7 más importante de Córdoba. Categorías para todas las edades, competencias profesionales y la mejor experiencia futbolística.",
    images: [
      {
        url: "/logos/isologo.png",
        width: 1200,
        height: 630,
        alt: "Copa Relámpago - Logo",
      },
      {
        url: "/logos/isologo.png",
        width: 800,
        height: 600,
        alt: "Copa Relámpago",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: "@coparelampago",
    creator: "@coparelampago",
    title: "Copa Relámpago | El Mejor Torneo de Fútbol 7 de Córdoba",
    description: "Copa Relámpago es el torneo de fútbol 7 más importante de Córdoba. Categorías para todas las edades, competencias profesionales y la mejor experiencia futbolística.",
    images: ["/logos/isologo.png"],
  },

  // Favicons e iconos
  icons: {
    icon: [
      { url: "/logos/favicon.ico" },
      { url: "/logos/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logos/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/logos/safari-pinned-tab.svg", color: "#2AD174" },
    ],
  },

  // Manifest para PWA
  manifest: "/manifest.json",

  // Configuración adicional
  category: "sports",
  classification: "Deportes y Recreación",

  // Datos estructurados básicos
  other: {
    "application-name": "Copa Relámpago",
    "msapplication-TileColor": "#2AD174",
    "msapplication-TileImage": "/logos/mstile-144x144.png",
    "theme-color": "#2AD174",
  },

  // Verificaciones
  verification: {
    google: "tu-codigo-google-aqui", // Reemplazar con código real
    // yandex: "tu-codigo-yandex-aqui",
    // yahoo: "tu-codigo-yahoo-aqui",
  },

  // Configuración para motores de búsqueda
  alternates: {
    canonical: "https://coparelampago.com",
    languages: {
      "es-AR": "https://coparelampago.com",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={mulish.variable}>
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Copa Relámpago",
              description: "El torneo de fútbol 7 más importante de Córdoba",
              url: "https://coparelampago.com",
              logo: "https://coparelampago.com/logos/isologo.png",
              sameAs: [
                "https://www.instagram.com/coparelampago/",
                "https://www.facebook.com/coparelampagocba/",
                "https://www.youtube.com/channel/UC-2-3-5-6-7"
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Córdoba",
                addressRegion: "Córdoba",
                addressCountry: "AR"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+54-351-818-2129",
                contactType: "customer service",
                availableLanguage: "Spanish"
              },
              sport: "Soccer"
            }),
          }}
        />

        {/* Preload de fuentes críticas */}
        <link
          rel="preload"
          href="/fonts/mulish-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/mulish-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${mulish.className} antialiased font-mulish`}>
        <Providers>
          {children}
        </Providers>
        <Toaster/>
      </body>
    </html>
  );
}