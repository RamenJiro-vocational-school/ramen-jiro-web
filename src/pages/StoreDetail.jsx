import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import stores from "../data/stores.json"

// 営業中判定ロジック
function getStatusClass(store) {
  const now = new Date()
  const today = now.getDay() === 0 ? 7 : now.getDay()
  const timeStr = now.toTimeString().slice(0, 5)

  if (!store.openDays.includes(today)) return { cls: "closed", text: "" }

  const hours = store.business_hours?.[today]
  if (!hours) return { cls: "closed", text: "" }

  const ranges = hours.split(",").map(r => r.trim())
  const inRange = ranges.some(range => {
    const [start, end] = range.split("-")
    return timeStr >= start && timeStr <= end
  })

  return inRange
    ? { cls: "open", text: hours }
    : { cls: "break", text: hours }
}

export default function StoreDetail() {
  const { id } = useParams()
  const store = stores.find(s => s.id === id)

  // --- お気に入り状態をLocalStorageで管理 ---
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorite(favs.includes(id))
  }, [id])

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
    let newFavs
    if (favs.includes(id)) {
      newFavs = favs.filter(f => f !== id)
      setFavorite(false)
    } else {
      newFavs = [...favs, id]
      setFavorite(true)
    }
    localStorage.setItem("favorites", JSON.stringify(newFavs))
  }

  if (!store) {
    return (
      <div className="store-detail">
        <h1>店舗が見つかりませんでした</h1>
      </div>
    )
  }

  const { cls, text } = getStatusClass(store)

  return (
    <div className="store-detail">
      {/* 店舗画像 */}
      <div className="store-image">
        <img src={store.image} alt={store.name} />
      </div>

      {/* 店名＋営業アイコン＋お気に入りボタン */}
      <div className="store-header">
        <h1>{store.name}</h1>
        <span className={`status-badge ${cls}`}>
          {cls === "open" && "🟢 営業中"}
          {cls === "break" && "🟡 休憩中"}
          {cls === "closed" && "🔴 定休日"}
        </span>
        <button
          className={`favorite-btn ${favorite ? "on" : ""}`}
          onClick={toggleFavorite}
        >
          {favorite ? "★ お気に入り" : "☆ お気に入り"}
        </button>
      </div>
      <p className="area">{store.area}</p>

      {/* 住所・アクセス */}
      <h2>住所</h2>
      <p>{store.address}</p>

      <h2>アクセス</h2>
      <p>{store.access}</p>

      {/* 営業時間 */}
      <h2>営業時間</h2>
      <ul>
        {Object.entries(store.business_hours).map(([day, hours]) => (
          <li key={day}>
            {day}曜日: {hours}
          </li>
        ))}
      </ul>
      {store.holidayNote && <p className="holiday">※{store.holidayNote}</p>}
      {text && <p className="now-hours">本日の営業時間: {text}</p>}

      {/* SNSリンク */}
      <h2>SNS</h2>
      <ul>
        {store.sns.twitter && (
          <li>
            <a href={store.sns.twitter} target="_blank" rel="noreferrer">
              Twitter
            </a>
          </li>
        )}
        {store.sns.instagram && (
          <li>
            <a href={store.sns.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
        )}
        {store.sns.official && (
          <li>
            <a href={store.sns.official} target="_blank" rel="noreferrer">
              公式サイト
            </a>
          </li>
        )}
      </ul>

      {/* メニュー */}
      <h2>メニュー</h2>
      <ul>
        {store.menu.map((item, i) => (
          <li key={i}>
            {item.name} - {item.price}円
          </li>
        ))}
      </ul>

      {/* その他情報 */}
      <h2>その他</h2>
      <p>調味料: {store.seasonings.join("、")}</p>
      <p>レンゲ: {store.hasRenge ? "あり" : "なし"}</p>
      <p>茹で調整: {store.boilAdjustable ? "可能" : "不可"}</p>
      <p>駐車情報: {store.parkingInfo}</p>
      {store.memo && <p>メモ: {store.memo}</p>}
    </div>
  )
}
