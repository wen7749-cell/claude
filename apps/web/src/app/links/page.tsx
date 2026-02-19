'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const RELATIONSHIP_TYPES = ['家族', '親族', '友人', '同僚・知人', 'その他'] as const
type RelationshipType = (typeof RELATIONSHIP_TYPES)[number]

type Connection = {
  id: string
  name: string
  relationship: string
  role: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

const EMPTY_FORM = { name: '', relationship: '家族' as RelationshipType, role: '', notes: '' }

export default function LinksPage() {
  const { data: session, status } = useSession()
  const [connections, setConnections] = useState<Connection[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('すべて')

  useEffect(() => {
    if (!session) return
    fetch('/api/links/connections').then((r) => r.json()).then(setConnections)
  }, [session])

  if (status === 'loading') return <p>読み込み中...</p>
  if (!session) {
    return <p>この機能を使うには <a href="/login">ログイン</a> が必要です。</p>
  }

  function handleChange<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) return

    if (editingId) {
      const res = await fetch(`/api/links/connections/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      })
      const updated: Connection = await res.json()
      setConnections((prev) => sortConnections(prev.map((c) => (c.id === editingId ? updated : c))))
      setEditingId(null)
    } else {
      const res = await fetch('/api/links/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      })
      const created: Connection = await res.json()
      setConnections((prev) => sortConnections([...prev, created]))
    }
    setForm(EMPTY_FORM)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/links/connections/${id}`, { method: 'DELETE' })
    setConnections((prev) => prev.filter((c) => c.id !== id))
    if (editingId === id) { setEditingId(null); setForm(EMPTY_FORM) }
  }

  function handleEdit(c: Connection) {
    setEditingId(c.id)
    setForm({ name: c.name, relationship: c.relationship as RelationshipType, role: c.role ?? '', notes: c.notes ?? '' })
  }

  function sortConnections(list: Connection[]) {
    return list.sort((a, b) => {
      const ri = RELATIONSHIP_TYPES.indexOf(a.relationship as RelationshipType) -
                 RELATIONSHIP_TYPES.indexOf(b.relationship as RelationshipType)
      return ri !== 0 ? ri : a.name.localeCompare(b.name, 'ja')
    })
  }

  const displayed = filterType === 'すべて' ? connections : connections.filter((c) => c.relationship === filterType)
  const countByType = (t: string) => connections.filter((c) => c.relationship === t).length
  const fieldStyle = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginBottom: '8px' }

  return (
    <div>
      <h1>Links — つながり</h1>
      <p>大切な人とのつながりを記録しましょう。</p>
      <hr />

      {connections.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {RELATIONSHIP_TYPES.map((t) =>
            countByType(t) > 0 ? (
              <span key={t} style={{ border: '1px solid #ccc', padding: '2px 10px', fontSize: '0.85rem' }}>
                {t} {countByType(t)}
              </span>
            ) : null,
          )}
          <span style={{ color: '#888', fontSize: '0.85rem', alignSelf: 'center' }}>合計 {connections.length} 人</span>
        </div>
      )}

      {/* Form */}
      <section style={{ border: '1px solid #ddd', padding: '14px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1rem', margin: '0 0 10px' }}>
          {editingId ? 'つながりを編集' : '新しいつながりを追加'}
        </h2>
        <label>名前 ＊
          <input style={fieldStyle} type="text" value={form.name}
            onChange={(e) => handleChange('name', e.target.value)} placeholder="山田 花子" />
        </label>
        <label>関係性
          <select style={fieldStyle} value={form.relationship}
            onChange={(e) => handleChange('relationship', e.target.value as RelationshipType)}>
            {RELATIONSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>具体的な役割・続柄
          <input style={fieldStyle} type="text" value={form.role}
            onChange={(e) => handleChange('role', e.target.value)} placeholder="母 / 幼なじみ / 同期 など" />
        </label>
        <label>メモ
          <textarea style={fieldStyle} rows={2} value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)} placeholder="思い出やエピソードなど..." />
        </label>
        <button onClick={handleSave} disabled={!form.name.trim()}>
          {editingId ? '更新する' : '追加する'}
        </button>
        {editingId && (
          <button style={{ marginLeft: '8px' }} onClick={() => { setEditingId(null); setForm(EMPTY_FORM) }}>
            キャンセル
          </button>
        )}
      </section>

      {/* Filter */}
      {connections.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          {(['すべて', ...RELATIONSHIP_TYPES] as const).map((t) => (
            <button key={t} style={{ marginRight: '6px', fontWeight: filterType === t ? 'bold' : 'normal',
              textDecoration: filterType === t ? 'underline' : 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
      )}

      {/* List */}
      {connections.length === 0 ? (
        <p style={{ color: '#999' }}>まだ登録されていません。大切な人を追加してみましょう。</p>
      ) : displayed.length === 0 ? (
        <p style={{ color: '#999' }}>該当するつながりがありません。</p>
      ) : (
        displayed.map((c) => (
          <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0',
            background: editingId === c.id ? '#fffbe6' : 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>{c.name}</strong>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                {c.relationship}{c.role ? `・${c.role}` : ''}
              </span>
            </div>
            {c.notes && (
              <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{c.notes}</p>
            )}
            <div style={{ marginTop: '6px' }}>
              <button onClick={() => handleEdit(c)}>編集</button>
              <button style={{ marginLeft: '8px' }} onClick={() => handleDelete(c.id)}>削除</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
