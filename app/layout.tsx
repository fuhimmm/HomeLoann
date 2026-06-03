import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HomeScore - Kalkulator Pinjaman Rumah',
  description: 'Hitung skor kelayakan dan simulasi pinjaman rumah Anda dengan mudah',
  generator: 'v0.app',
  openGraph: {
    title: 'HomeScore - Kalkulator Pinjaman Rumah',
    description: 'Hitung skor kelayakan dan simulasi pinjaman rumah Anda dengan mudah',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${_geist.className} font-sans antialiased bg-gray-50 text-gray-900`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
