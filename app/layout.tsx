import type { Metadata } from 'next'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "EASYSHOP UZB",
  description: "EASYSHOP UZB online clothing store with product catalog, Telegram webhook integrations, and virtual try-on features.",
  openGraph: {
    title: "EASYSHOP UZB",
    description: "EASYSHOP UZB online clothing store with product catalog, Telegram webhook integrations, and virtual try-on features.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className="font-sans antialiased bg-[#070b14] text-white">
        {children}
      </body>
    </html>
  )
}


