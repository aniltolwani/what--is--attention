// RootLayout Component in app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Transformer Insight Explorer',
  description: 'Explore and visualize word embeddings and vector operations',
}

/**
 * RootLayout serves as the root layout component for the Next.js application.
 * It wraps all pages and applies global styles and font settings.
 *
 * @param {React.ReactNode} children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The HTML structure with applied styles and fonts.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the Inter font and full width to the body */}
      <body className={`${inter.className} w-full bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}