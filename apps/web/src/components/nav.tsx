'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/links', label: 'Links' },
  { href: '/story', label: 'Story' },
  { href: '/self', label: 'Self' },
]

export default function Nav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '24px' }}>
      <strong>LifeLink</strong>
      <nav style={{ display: 'inline-block', marginLeft: '24px' }}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            style={{
              marginRight: '16px',
              fontWeight: pathname === l.href ? 'bold' : 'normal',
              textDecoration: pathname === l.href ? 'underline' : 'none',
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <span style={{ float: 'right', fontSize: '0.85rem', color: '#555' }}>
        {session ? (
          <>
            {session.user?.name ?? session.user?.email}
            {' '}
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#555', textDecoration: 'underline' }}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <a href="/login">ログイン</a>
            {' | '}
            <a href="/register">新規登録</a>
          </>
        )}
      </span>
    </header>
  )
}
