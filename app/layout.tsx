import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import { Toaster } from "sonner"

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TimeLine Game",
  description: "A daily historical event sequencing game",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'