import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookpad - AT Protocol Service',
  description: 'AT Protocol Service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}