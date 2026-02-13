import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'דשבורד חתונה',
  description: 'ניהול חתונה - מוזמנים, משימות ותקציב',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-[family-name:var(--font-heebo)] antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
