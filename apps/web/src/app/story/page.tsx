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
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [events, setEvents] = useState<LifeEvent[]>([])
  const [eventForm, setEventForm] = useState(EMPTY_EVENT)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [savingEvent, setSavingEvent] = useState(false)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [eventError, setEventError] = useState('')

  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch('/api/story/profile').then((r) => {
        if (!r.ok) throw new Error('プロフィールの読み込みに失敗しました')
        return r.json()
      }),
      fetch('/api/story/events').then((r) => {
        if (!r.ok) throw new Error('イベントの読み込みに失敗しました')
        return r.json()
      }),
    ])
      .then(([p, ev]: [Profile | null, LifeEvent[]]) => {
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
        setEvents(ev)
      })
      .catch((e: Error) => setFetchError(e.message))
  }, [session])

  if (status === 'loading') return <p>読み込み中...</p>
  if (!session) {
    return <p>この機能を使うには <a href="/login">ログイン</a> が必要です。</p>
  }

  async function handleProfileSave() {
    setSavingProfile(true)
    setProfileError('')
    try {
      const res = await fetch('/api/story/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileDraft),
      })
      if (!res.ok) throw new Error('プロフィールの保存に失敗しました')
      const saved: Profile = await res.json()
      setProfile(saved)
      setEditingProfile(false)
    } catch (e: unknown) {
      setProfileError(e instanceof Error ? e.message : '保存に失敗しました')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleEventSave() {
    const { year, title, description } = eventForm
    if (!title.trim()) return

    setSavingEvent(true)
    setEventError('')
    try {
      if (editingEventId) {
        const res = await fetch(`/api/story/events/${editingEventId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year, title: title.trim(), description }),
        })
        if (!res.ok) throw new Error('イベントの更新に失敗しました')
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
        if (!res.ok) throw new Error('イベントの保存に失敗しました')
        const created: LifeEvent = await res.json()
        setEvents((prev) =>
          [...prev, created].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999)),
        )
      }
      setEventForm(EMPTY_EVENT)
    } catch (e: unknown) {
      setEventError(e instanceof Error ? e.message : '保存に失敗しました')
    } finally {
      setSavingEvent(false)
    }
  }

  async function handleEventDelete(id: string) {
    setDeletingEventId(id)
    setEventError('')
    try {
      const res = await fetch(`/api/story/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('削除に失敗しました')
      setEvents((prev) => prev.filter((e) => e.id !== id))
      if (editingEventId === id) { setEditingEventId(null); setEventForm(EMPTY_EVENT) }
    } catch (e: unknown) {
      setEventError(e instanceof Error ? e.message : '削除に失敗しました')
    } finally {
      setDeletingEventId(null)
    }
  }

  function handleEventEdit(ev: LifeEvent) {
    setEditingEventId(ev.id)
    setEventForm({ year: ev.year?.toString() ?? '', title: ev.title, description: ev.description ?? '' })
    setEventError('')
  }

  const fieldStyle = { display: 'block', width: '100%', boxSizing: 'border-box' as const, marginBottom: '8px' }
  const sectionStyle = { marginBottom: '40px' }

  return (
    <div>
      <h1>Story — 物語</h1>
      <p>あなたの人生を記録しましょう。プロフィールと歩みを残してください。</p>
      <hr />

      {fetchError && (
        <p style={{ color: 'red', border: '1px solid red', padding: '8px' }}>{fetchError}</p>
      )}

      {/* ── Profile ── */}
      <section style={sectionStyle}>
        <h2>プロフィール</h2>
        {profileError && <p style={{ color: 'red' }}>{profileError}</p>}

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
            <button onClick={() => { setEditingProfile(true); setProfileError('') }}>編集</button>
          </div>
        ) : (
          <div>
            <label>
              名前
              <input style={fieldStyle} type="text" value={profileDraft.name}
                onChange={(e) => setProfileDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="山田 太郎" disabled={savingProfile} />
            </label>
            <label>
              生年（西暦）
              <input style={fieldStyle} type="text" value={profileDraft.birthYear}
                onChange={(e) => setProfileDraft((p) => ({ ...p, birthYear: e.target.value }))}
                placeholder="1960" disabled={savingProfile} />
            </label>
            <label>
              出身・在住地
              <input style={fieldStyle} type="text" value={profileDraft.location}
                onChange={(e) => setProfileDraft((p) => ({ ...p, location: e.target.value }))}
                placeholder="東京都" disabled={savingProfile} />
            </label>
            <label>
              自己紹介・一言
              <textarea style={fieldStyle} rows={3} value={profileDraft.bio}
                onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))}
                placeholder="自分らしい一文を書いてみましょう..." disabled={savingProfile} />
            </label>
            <button onClick={handleProfileSave}
              disabled={savingProfile || !profileDraft.name.trim()}>
              {savingProfile ? '保存中...' : '保存する'}
            </button>
            {profile && (
              <button style={{ marginLeft: '8px' }} disabled={savingProfile}
                onClick={() => { setEditingProfile(false); setProfileError('') }}>
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
        {eventError && <p style={{ color: 'red' }}>{eventError}</p>}

        <div style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>
            {editingEventId ? 'イベントを編集' : '新しいイベントを追加'}
          </h3>
          <label>
            年（西暦）
            <input style={fieldStyle} type="text" value={eventForm.year}
              onChange={(e) => setEventForm((f) => ({ ...f, year: e.target.value }))}
              placeholder="1985" disabled={savingEvent} />
          </label>
          <label>
            タイトル ＊
            <input style={fieldStyle} type="text" value={eventForm.title}
              onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="大学入学" disabled={savingEvent} />
          </label>
          <label>
            詳細
            <textarea style={fieldStyle} rows={3} value={eventForm.description}
              onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="そのときの気持ちや背景を書いてみましょう..." disabled={savingEvent} />
          </label>
          <button onClick={handleEventSave} disabled={savingEvent || !eventForm.title.trim()}>
            {savingEvent ? '保存中...' : editingEventId ? '更新する' : '追加する'}
          </button>
          {editingEventId && (
            <button style={{ marginLeft: '8px' }} disabled={savingEvent}
              onClick={() => { setEditingEventId(null); setEventForm(EMPTY_EVENT); setEventError('') }}>
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
              opacity: deletingEventId === ev.id ? 0.5 : 1,
              background: editingEventId === ev.id ? '#fffbe6' : 'transparent',
            }}>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>{ev.year ?? '年不明'}</div>
              <strong>{ev.title}</strong>
              {ev.description && (
                <p style={{ margin: '4px 0', whiteSpace: 'pre-wrap', color: '#333' }}>{ev.description}</p>
              )}
              <div style={{ marginTop: '4px' }}>
                <button onClick={() => handleEventEdit(ev)}
                  disabled={deletingEventId === ev.id}>編集</button>
                <button style={{ marginLeft: '8px' }}
                  onClick={() => handleEventDelete(ev.id)}
                  disabled={deletingEventId === ev.id}>
                  {deletingEventId === ev.id ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
