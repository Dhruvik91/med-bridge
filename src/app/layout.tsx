import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AppShell } from '@/components/app-shell'
import { GTMPageView } from '@/components/GTMPageView'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'MedBridges - Connecting Doctors with Healthcare Opportunities',
    template: '%s | MedBridges'
  },
  description: 'Professional healthcare job marketplace connecting qualified doctors with hospitals and healthcare facilities. Find your next medical career opportunity.',
  keywords: ['medical jobs', 'doctor jobs', 'healthcare careers', 'hospital jobs', 'physician recruitment', 'medical marketplace'],
  authors: [{ name: 'MedBridges' }],
  creator: 'MedBridges',
  publisher: 'MedBridges',
  applicationName: 'MedBridges',
  metadataBase: new URL('https://medbridges.xyz'),
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MedBridges'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medbridges.xyz',
    title: 'MedBridges - Connecting Doctors with Healthcare Opportunities',
    description: 'Professional healthcare job marketplace connecting qualified doctors with hospitals and healthcare facilities.',
    siteName: 'MedBridges',
    images: [
      {
        url: 'https://medbridge-portal.s3.ap-south-1.amazonaws.com/BannerImage.png',
        width: 1200,
        height: 630,
        alt: 'MedBridges - Healthcare Job Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedBridges - Connecting Doctors with Healthcare Opportunities',
    description: 'Professional healthcare job marketplace for doctors and hospitals.',
    images: ['https://medbridge-portal.s3.ap-south-1.amazonaws.com/BannerImage.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MedBridges",
              "alternateName": ["Med Bridges", "MedBridge"],
              "url": "https://medbridges.xyz"
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              <AppShell>
                <GTMPageView />
                {children}
              </AppShell>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}