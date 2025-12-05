import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AppShell } from '@/components/app-shell'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'MedBridge - Connecting Doctors with Healthcare Opportunities',
    template: '%s | MedBridge'
  },
  description: 'Professional healthcare job marketplace connecting qualified doctors with hospitals and healthcare facilities. Find your next medical career opportunity.',
  keywords: ['medical jobs', 'doctor jobs', 'healthcare careers', 'hospital jobs', 'physician recruitment', 'medical marketplace'],
  authors: [{ name: 'MedBridge' }],
  creator: 'MedBridge',
  publisher: 'MedBridge',
  metadataBase: new URL('https://medbridge.com'),
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MedBridge'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medbridge.com',
    title: 'MedBridge - Connecting Doctors with Healthcare Opportunities',
    description: 'Professional healthcare job marketplace connecting qualified doctors with hospitals and healthcare facilities.',
    siteName: 'MedBridge',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MedBridge - Healthcare Job Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedBridge - Connecting Doctors with Healthcare Opportunities',
    description: 'Professional healthcare job marketplace for doctors and hospitals.',
    images: ['/og-image.jpg']
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              <AppShell>
                {children}
              </AppShell>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}