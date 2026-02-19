'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Profile = {
  name: string
  birthYear: number | null
  location: string | null
  bio: string | null
}

type LifeEvent = {
  id: string
  year: number | null
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

const EMPTY_PROFILE = { name: '', birthYear: '', location: '', bio: '' }
const EMPTY_EVENT = { year: '', title: '', description: '' }

export default function StoryPage() {
  const { data: session, status } = useSession()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileDraft, setProfileDraft] = useState(EMPTY_PROFILE)
  const [editingProfile, setEditingProfile] = useState(false)

  const [events, setEvents] = useState<LifeEvent[]>([])
  const [eventForm, setEventForm] = useState(EMPTY_EVENT)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    fetch('/api/story/profile').then((r) => r.json()).then((p: Profile | null) => {
      setProfile(p)
      if (p) {
        setProfileDraft({
          name: p.name,
          birthYear: p.birthYear?.toString() ?? '',
          location: p.location ?? '',
          bio: p.bio ?? '',
        })
      } else {
        setEditingProfile(true)
      }
    })
    fetch('/api/story/events').then((r) => r.json()).then(setEvents)
  }, [session])

  if (status === 'loading') return <p>読み込み中...</p>
  if (!session) {
    return <p>この機能を使うには <a href="/login">ログイン</a> が必要です。</p>
  }

  async function handleProfileSave() {
    const res = await fetch('/api/story/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileDraft),
    })
    const saved: Profile = await res.json()
    setProfile(saved)
    setEditingProfile(false)
  }

  async function handleEventSave() {
    const { year, title, description } = eventForm
    if (!title.trim()) return

    if (editingEventId) {
      const res = await fetch(`/api/story/events/${editingEventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, title: title.trim(), description }),
      })
      const updated: LifeEvent = await res.json()
      setEvents((prev) =>
        [...prev.map((e) => (e.id === editingEventId ? updated : e))].sort(
          (a, b) => (a.year ?? 9999) - (b.year ?? 9999),
        ),
      )
      setEditingEventId(null)
    } else {
      const res = await fetch('/api/story/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, title: title.trim(), description }),
      })
      const created: LifeEvent = await res.json()
      setEvents((prev) =>
        [...prev, created].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999)),
      )
    }
    setEventForm(EMPTY_EVENT)
  }

  async function handleEventDelete(id: string) {
    await fetch(`/api/story/events/${id}`, { method: 'DELETE' })
    setEvents((prev) => prev.filter((e) => e.id !== id))
    if (editingEventId === id) {
      setEditingEventId(null)
      setEventForm(EMPTY_EVENT)
    }
  }

  function handleEventEdit(ev: LifeEvent) {
    setEditingEventId(ev.id)
    setEventForm({
      year: ev.year?.toString() ?? '',
      title: ev.title,
      description: ev.description ?? '',
    })
  }

  const fieldStyle = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginBottom: '8px' }
  const sectionStyle = { marginBottom: '40px' }

  return (
    <div>
      <h1>Story — 物語</h1>
      <p>あなたの人生を記録しましょう。プロフィールと歩みを残してください。</p>
      <hr />

      {/* ── Profile ── */}
      <section style={sectionStyle}>
        <h2>プロフィール</h2>

        {!editingProfile && profile ? (
          <div style={{ border: '1px solid #ddd', padding: '12px', background: '#fafafa' }}>
            <p style={{ margin: '0 0 4px' }}><strong>{profile.name}</strong></p>
            {profile.birthYear && (
              <p style={{ margin: '0 0 4px', color: '#555' }}>
                {profile.birthYear}年生まれ　{profile.location}
              </p>
            )}
            {profile.bio && (
              <p style={{ margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>
            )}
            <button onClick={() => setEditingProfile(true)}>編集</button>
          </div>
        ) : (
          <div>
            <label>
              名前
              <input style={fieldStyle} type="text" value={profileDraft.name}
                onChange={(e) => setProfileDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="山田 太郎" />
            </label>
            <label>
              生年（西暦）
              <input style={fieldStyle} type="text" value={profileDraft.birthYear}
                onChange={(e) => setProfileDraft((p) => ({ ...p, birthYear: e.target.value }))}
                placeholder="1960" />
            </label>
            <label>
              出身・在住地
              <input style={fieldStyle} type="text" value={profileDraft.location}
                onChange={(e) => setProfileDraft((p) => ({ ...p, location: e.target.value }))}
                placeholder="東京都" />
            </label>
            <label>
              自己紹介・一言
              <textarea style={fieldStyle} rows={3} value={profileDraft.bio}
                onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))}
                placeholder="自分らしい一文を書いてみましょう..." />
            </label>
            <button onClick={handleProfileSave} disabled={!profileDraft.name.trim()}>保存する</button>
            {profile && (
              <button style={{ marginLeft: '8px' }} onClick={() => setEditingProfile(false)}>
                キャンセル
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Life Events ── */}
      <section style={sectionStyle}>
        <h2>ライフイベント</h2>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>人生の転機・出来事を年ごとに記録できます。</p>

        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>
            {editingEventId ? 'イベントを編集' : '新しいイベントを追加'}
          </h3>
          <label>
            年（西暦）
            <input style={fieldStyle} type="text" value={eventForm.year}
              onChange={(e) => setEventForm((f) => ({ ...f, year: e.target.value }))}
              placeholder="1985" />
          </label>
          <label>
            タイトル ＊
            <input style={fieldStyle} type="text" value={eventForm.title}
              onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="大学入学" />
          </label>
          <label>
            詳細
            <textarea style={fieldStyle} rows={3} value={eventForm.description}
              onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="そのときの気持ちや背景を書いてみましょう..." />
          </label>
          <button onClick={handleEventSave} disabled={!eventForm.title.trim()}>
            {editingEventId ? '更新する' : '追加する'}
          </button>
          {editingEventId && (
            <button style={{ marginLeft: '8px' }} onClick={() => {
              setEditingEventId(null)
              setEventForm(EMPTY_EVENT)
            }}>
              キャンセル
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <p style={{ color: '#999' }}>まだイベントがありません。最初の出来事を追加してみましょう。</p>
        ) : (
          events.map((ev) => (
            <div key={ev.id} style={{
              borderLeft: '3px solid #999',
              paddingLeft: '12px',
              marginBottom: '16px',
              background: editingEventId === ev.id ? '#fffbe6' : 'transparent',
            }}>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>{ev.year ?? '年不明'}</div>
              <strong>{ev.title}</strong>
              {ev.description && (
                <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap', color: '#333' }}>{ev.description}</p>
              )}
              <div style={{ marginTop: '4px' }}>
                <button onClick={() => handleEventEdit(ev)}>編集</button>
                <button style={{ marginLeft: '8px' }} onClick={() => handleEventDelete(ev.id)}>削除</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
