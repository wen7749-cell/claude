'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('test@lifelink.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('メールアドレスまたはパスワードが正しくありません。')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const fieldStyle = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box' as const,
    marginBottom: '12px',
    padding: '6px',
  }

  return (
    <div style={{ maxWidth: '360px', margin: '40px auto' }}>
      <h1 style={{ marginBottom: '4px' }}>ログイン</h1>
      <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '20px' }}>
        MVP テスト用: <code>test@lifelink.local</code> / <code>lifelink</code>
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          メールアドレス
          <input
            style={fieldStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          パスワード
          <input
            style={fieldStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '8px' }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '8px' }}>
          {loading ? '確認中...' : 'ログイン'}
        </button>
      </form>
    </div>
  )
}
