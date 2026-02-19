'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const PROMPTS = [
  { id: 1, text: '今の自分に最も影響を与えた出来事は何ですか？' },
  { id: 2, text: 'あなたが大切にしている価値観を教えてください。' },
  { id: 3, text: '人生で後悔していることと、そこから学んだことは？' },
  { id: 4, text: '自分の人生で誇りに思う瞬間を一つ挙げてください。' },
  { id: 5, text: '未来の自分（または大切な人）へ伝えたいことは何ですか？' },
] as const

type SavedAnswer = {
  id: string
  promptId: number
  promptText: string
  answer: string
  createdAt: string
  updatedAt: string
}

export default function SelfPage() {
  const { data: session, status } = useSession()
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [saved, setSaved] = useState<SavedAnswer[]>([])
  const [editing, setEditing] = useState<{ id: string; promptId: number } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    setLoading(true)
    fetch('/api/self/answers')
      .then((r) => r.json())
      .then((data: SavedAnswer[]) => setSaved(data))
      .finally(() => setLoading(false))
  }, [session])

  if (status === 'loading') return <p>読み込み中...</p>
  if (!session) {
    return (
      <p>
        この機能を使うには <a href="/login">ログイン</a> が必要です。
      </p>
    )
  }

  function handleInput(promptId: number, value: string) {
    setInputs((prev) => ({ ...prev, [promptId]: value }))
  }

  async function handleSave(promptId: number, promptText: string) {
    const answer = (inputs[promptId] ?? '').trim()
    if (!answer) return

    if (editing && editing.promptId === promptId) {
      const res = await fetch(`/api/self/answers/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      })
      const updated: SavedAnswer = await res.json()
      setSaved((prev) => prev.map((a) => (a.id === editing.id ? updated : a)))
      setEditing(null)
    } else {
      const res = await fetch('/api/self/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, promptText, answer }),
      })
      const created: SavedAnswer = await res.json()
      setSaved((prev) => [...prev, created])
    }

    setInputs((prev) => ({ ...prev, [promptId]: '' }))
  }

  function handleEdit(entry: SavedAnswer) {
    setEditing({ id: entry.id, promptId: entry.promptId })
    setInputs((prev) => ({ ...prev, [entry.promptId]: entry.answer }))
  }

  async function handleDelete(id: string) {
    await fetch(`/api/self/answers/${id}`, { method: 'DELETE' })
    setSaved((prev) => prev.filter((a) => a.id !== id))
    setEditing((prev) => (prev?.id === id ? null : prev))
  }

  const savedByPrompt = (promptId: number) => saved.filter((a) => a.promptId === promptId)

  return (
    <div>
      <h1>Self — 振り返り</h1>
      <p>人生の棚卸し。プロンプトに答えながら、自分を再発見しましょう。</p>
      <hr />

      {loading && <p>データを読み込み中...</p>}

      {PROMPTS.map((prompt) => {
        const isEditing = editing?.promptId === prompt.id
        const answers = savedByPrompt(prompt.id)

        return (
          <section key={prompt.id} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>
              {prompt.id}. {prompt.text}
            </h2>

            <textarea
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={inputs[prompt.id] ?? ''}
              onChange={(e) => handleInput(prompt.id, e.target.value)}
              placeholder="ここに回答を入力してください..."
            />
            <div style={{ marginTop: '4px' }}>
              <button onClick={() => handleSave(prompt.id, prompt.text)}>
                {isEditing ? '更新する' : '保存する'}
              </button>
              {isEditing && (
                <button
                  style={{ marginLeft: '8px' }}
                  onClick={() => {
                    setEditing(null)
                    setInputs((prev) => ({ ...prev, [prompt.id]: '' }))
                  }}
                >
                  キャンセル
                </button>
              )}
            </div>

            {answers.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                {answers.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '10px',
                      marginBottom: '8px',
                      background: editing?.id === entry.id ? '#fffbe6' : '#fafafa',
                    }}
                  >
                    <p style={{ margin: '0 0 6px', whiteSpace: 'pre-wrap' }}>{entry.answer}</p>
                    <small style={{ color: '#666' }}>
                      保存: {new Date(entry.createdAt).toLocaleString('ja-JP')}
                      {entry.updatedAt !== entry.createdAt && (
                        <> &middot; 更新: {new Date(entry.updatedAt).toLocaleString('ja-JP')}</>
                      )}
                    </small>
                    <div style={{ marginTop: '6px' }}>
                      <button onClick={() => handleEdit(entry)}>編集</button>
                      <button style={{ marginLeft: '8px' }} onClick={() => handleDelete(entry.id)}>
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
