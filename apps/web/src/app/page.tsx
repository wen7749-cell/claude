export default function HomePage() {
  const pillars = [
    {
      href: '/links',
      label: 'Links — つながり',
      emoji: '🔗',
      desc: '家族・友人・知人との縁を記録する。縦のつながり（家系）も、横のつながり（コミュニティ）も。',
      cta: 'つながりを記録する →',
    },
    {
      href: '/story',
      label: 'Story — 物語',
      emoji: '📖',
      desc: '自分の人生をプロフィールとライフイベントとして残す。記憶を散逸させない。',
      cta: '物語を書き始める →',
    },
    {
      href: '/self',
      label: 'Self — 自己',
      emoji: '🪞',
      desc: '振り返りプロンプトに答えながら、自分の価値観・転機・想いを言語化する。',
      cta: '振り返りを始める →',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>LifeLink</h1>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '4px' }}>
          <em>Your links. Your story. Your self.</em>
        </p>
        <p style={{ color: '#777', maxWidth: '480px', margin: '0 auto' }}>
          人生のつながりを編み直し、物語として残し、自分を再発見できる場所。
        </p>
      </div>

      {/* Pillars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {pillars.map((p) => (
          <div
            key={p.href}
            style={{ border: '1px solid #ddd', padding: '20px' }}
          >
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 8px' }}>
              {p.emoji} {p.label}
            </h2>
            <p style={{ color: '#555', margin: '0 0 12px', lineHeight: '1.6' }}>{p.desc}</p>
            <a href={p.href}>{p.cta}</a>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginTop: '48px' }}>
        MVP — データはブラウザのローカルストレージに保存されます。
      </p>
    </div>
  )
}
