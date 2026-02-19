'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('パスワードが一致しません')
      return
    }
    if (form.password.length < 8) {
      setError('パスワードは8文字以上にしてください')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? '登録に失敗しました')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('登録後のログインに失敗しました。ログインページからお試しください。')
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
      <h1 style={{ marginBottom: '4px' }}>新規登録</h1>
      <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '20px' }}>
        アカウントを作成して、LifeLink を始めましょう。
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          名前（任意）
          <input
            style={fieldStyle}
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="山田 太郎"
          />
        </label>
        <label>
          メールアドレス ＊
          <input
            style={fieldStyle}
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </label>
        <label>
          パスワード ＊（8文字以上）
          <input
            style={fieldStyle}
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
        </label>
        <label>
          パスワード（確認）＊
          <input
            style={fieldStyle}
            type="password"
            value={form.confirm}
            onChange={(e) => handleChange('confirm', e.target.value)}
            required
          />
        </label>

        {error && (
          <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '8px' }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '8px' }}>
          {loading ? '登録中...' : 'アカウントを作成'}
        </button>
      </form>

      <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#555' }}>
        すでにアカウントをお持ちの方は <a href="/login">ログイン</a>
      </p>
    </div>
  )
}
