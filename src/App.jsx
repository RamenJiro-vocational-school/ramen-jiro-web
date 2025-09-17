import stores from './data/stores.json'
import { useState, useEffect } from 'react'

export default function App() {
  const [visited, setVisited] = useState(() => {
    const saved = localStorage.getItem('visitedStores')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('visitedStores', JSON.stringify(visited))
  }, [visited])

  const toggleVisit = (name) => {
    setVisited(prev =>
      prev.includes(name)
        ? prev.filter(x => x !== name)
        : [...prev, name]
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>ラーメン二郎 スタンプラリー</h1>
      <p>{visited.length} / {stores.length} 店舗達成！</p>

      {stores.map(s => (
        <div key={s.name} style={{ margin: '10px 0' }}>
          <strong>{s.name}</strong>（{s.area}）
          <button style={{ marginLeft: 12 }}
                  onClick={() => toggleVisit(s.name)}>
            {visited.includes(s.name) ? '✅ 訪問済' : 'スタンプGET'}
          </button>
        </div>
      ))}
    </div>
  )
}
