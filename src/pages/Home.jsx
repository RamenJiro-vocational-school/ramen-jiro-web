import stores from '../data/stores.json'
import logo from '../assets/title_01.png'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// 現在時刻から営業中/休憩中/定休日を判定する関数
function getStatusClass(store) {
  const now = new Date()
  const today = now.getDay() === 0 ? 7 : now.getDay() // 日曜=7
  const timeStr = now.toTimeString().slice(0, 5)

  // 今日が営業日でない
  if (!store.openDays.includes(today)) return { cls: 'closed', text: '' }

  // 今日の営業時間
  const hours = store.business_hours?.[today]
  if (!hours) return { cls: 'closed', text: '' }

  // 複数時間帯に対応
  const ranges = hours.split(',').map(r => r.trim())
  const inRange = ranges.some(range => {
    const [start, end] = range.split('-')
    return timeStr >= start && timeStr <= end
  })

  return inRange
    ? { cls: 'open', text: hours }
    : { cls: 'break', text: hours }
}

export default function Home() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])

  // --- localStorage からお気に入りを読み込む ---
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(favs)
  }, [])

  return (
    <div>
      <div className="logo-header">
        <img src={logo} alt="ラーメン二郎データベース" className="logo" />
      </div>

      <div className="store-grid">
        {stores.map((s, i) => {
          const { cls, text } = getStatusClass(s) // open/break/closed と 営業時間文字列
          const isFav = favorites.includes(s.id) // --- お気に入り判定 ---

          return (
            <div
              key={i}
              className={`store-card ${cls}`}
              onClick={() => navigate(`/store/${s.id}`)}
            >
              {/* 星アイコン（右上） */}
              {isFav && <div className="fav-star">★</div>}
              <div className="store-name">{s.name}</div>
              <div className="store-hours">{text}</div>
            </div>

          )
        })}
      </div>
      <div className="store-extra">
        {/* 後でアイコンや混雑度を差し込む */}
      </div>

    </div>
  )
}
