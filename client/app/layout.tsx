import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BookHive - Bluesky OAuth',
  description: 'AT Protocol API 테스트',
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