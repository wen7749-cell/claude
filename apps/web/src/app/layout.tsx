import type { Metadata } from 'next'
import Providers from './providers'
import Nav from '@/components/nav'

export const metadata: Metadata = {
  title: 'LifeLink',
  description: 'Your links. Your story. Your self.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        <Providers>
          <Nav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
