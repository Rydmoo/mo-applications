import './styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ThemeToggle from './components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FiveM Server Whitelist Application',
  description: 'Apply to join our FiveM roleplay server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background text-foreground">
            <header className="container mx-auto p-4">
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </header>
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}