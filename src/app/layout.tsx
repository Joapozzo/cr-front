import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "react-hot-toast";
import { getTenantConfig } from "@/config/tenant.loader";

// Configuración de Mulish con todos los pesos
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mulish",
  display: "swap",
});

// Cargar configuración del tenant
const tenantConfig = getTenantConfig();

// Función helper para convertir hex a rgba
const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// Generar variables CSS del tenant
const generateTenantCSSVariables = (config: typeof tenantConfig): string => {
  const { colores } = config;
  
  return `
    :root {
      /* Colores principales del tenant - inyectados dinámicamente */
      --color-primary: ${colores.primary};
      --color-primary-strong: ${colores.primaryStrong};
      --color-primary-opacity: ${hexToRgba(colores.primary, 0.2)};
      --color-primary-rgb: ${hexToRgb(colores.primary)};
      --color-secondary: ${colores.secondary};
      --color-success: ${colores.success};
      --color-danger: ${colores.danger};
      --color-warning: ${colores.warning};
      
      /* Variables derivadas para mantener compatibilidad */
      --color-primary-300: ${hexToRgba(colores.primary, 0.3)};
      --color-primary-400: ${hexToRgba(colores.primary, 0.4)};
      --color-primary-500: ${colores.success};
      --color-primary-800: ${colores.primaryStrong};
      
      --color-secondary-100: ${hexToRgba(colores.secondary, 0.1)};
      --color-secondary-300: ${hexToRgba(colores.secondary, 0.3)};
      --color-secondary-400: ${hexToRgba(colores.secondary, 0.4)};
      --color-secondary-500: ${colores.secondary};
      --color-secondary-600: ${colores.danger};
      --color-secondary-700: ${colores.danger};
    }
  `;
};

// Generar metadata dinámicamente basado en el tenant
export const metadata: Metadata = {
  title: {
    template: `%s | ${tenantConfig.nombre_empresa}`,
    default: tenantConfig.branding.titulo_pagina,
  },
  description: tenantConfig.seo.description,
  keywords: tenantConfig.seo.keywords,
  authors: [{ name: tenantConfig.nombre_empresa }],
  creator: tenantConfig.nombre_empresa,
  publisher: tenantConfig.nombre_empresa,
  metadataBase: new URL(`https://${tenantConfig.id}.com`),

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
    url: `https://${tenantConfig.id}.com`,
    siteName: tenantConfig.nombre_empresa,
    title: tenantConfig.branding.titulo_pagina,
    description: tenantConfig.seo.description,
    images: [
      {
        url: tenantConfig.branding.logo_principal,
        width: 1200,
        height: 630,
        alt: `${tenantConfig.nombre_empresa} - Logo`,
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: `@${tenantConfig.contacto.redes.instagram.replace('@', '')}`,
    creator: `@${tenantConfig.contacto.redes.instagram.replace('@', '')}`,
    title: tenantConfig.branding.titulo_pagina,
    description: tenantConfig.seo.description,
    images: [tenantConfig.branding.logo_principal],
  },

  // Favicons e iconos - usando la carpeta específica del tenant
  icons: {
    icon: [
      { url: `${tenantConfig.branding.favicons_path}/favicon.ico` },
      { url: `${tenantConfig.branding.favicons_path}/icon1.png`, sizes: "32x32", type: "image/png" },
      { url: `${tenantConfig.branding.favicons_path}/icon1.png`, sizes: "16x16", type: "image/png" },
      { url: `${tenantConfig.branding.favicons_path}/icon0.svg`, type: "image/svg+xml" },
    ],
    apple: [
      { url: `${tenantConfig.branding.favicons_path}/apple-icon.png`, sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: `${tenantConfig.branding.favicons_path}/icon0.svg`, color: tenantConfig.colores.primary },
    ],
  },

  // Manifest para PWA - usando el manifest específico del tenant
  manifest: `${tenantConfig.branding.favicons_path}/manifest.json`,

  // Configuración adicional
  category: "sports",
  classification: "Deportes y Recreación",

  // Datos estructurados básicos
  other: {
    "application-name": tenantConfig.nombre_empresa,
    "msapplication-TileColor": tenantConfig.colores.primary,
    "msapplication-TileImage": tenantConfig.branding.logo_principal,
    "theme-color": tenantConfig.colores.primary,
  },

  // Configuración para motores de búsqueda
  alternates: {
    canonical: `https://${tenantConfig.id}.com`,
    languages: {
      "es-AR": `https://${tenantConfig.id}.com`,
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
        {/* Inyectar variables CSS del tenant dinámicamente */}
        <style
          dangerouslySetInnerHTML={{
            __html: generateTenantCSSVariables(tenantConfig),
          }}
        />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: tenantConfig.nombre_empresa,
              description: tenantConfig.seo.description,
              url: `https://${tenantConfig.id}.com`,
              logo: `https://${tenantConfig.id}.com${tenantConfig.branding.logo_principal}`,
              sameAs: [
                `https://www.instagram.com/${tenantConfig.contacto.redes.instagram.replace('@', '')}/`,
                `https://www.facebook.com/${tenantConfig.contacto.redes.facebook}/`,
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: tenantConfig.contacto.direccion.split(',')[0],
                addressRegion: "Córdoba",
                addressCountry: "AR"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: tenantConfig.contacto.telefono,
                contactType: "customer service",
                availableLanguage: "Spanish"
              },
              sport: tenantConfig.tipo_futbol === "futbol-7" ? "Fútbol 7" : "Fútbol 11"
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
      <body className={`${mulish.className} antialiased font-mulish`} suppressHydrationWarning>
        <Providers tenantConfig={tenantConfig}>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
