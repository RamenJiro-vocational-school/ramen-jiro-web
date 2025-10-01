import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import stores from "../data/stores.json"

const dayMap = {
  1: "月曜",
  2: "火曜",
  3: "水曜",
  4: "木曜",
  5: "金曜",
  6: "土曜",
  7: "日曜"
}

// 営業ステータス判定
function getStatus(store) {
  const now = new Date()
  const today = now.getDay() === 0 ? 7 : now.getDay() // 日曜=7
  const timeStr = now.toTimeString().slice(0, 5) // "HH:MM"

  const hours = store.business_hours?.[today]

  if (!hours) {
    return { cls: "closed", text: "定休日" }
  }

  // 複数時間帯対応
  const ranges = hours.split(",").map(r => r.trim())
  const inRange = ranges.some(range => {
    const [start, end] = range.split("-")
    return timeStr >= start && timeStr <= end
  })

  if (inRange) {
    return { cls: "open", text: "営業中" }
  } else {
    return { cls: "prep", text: "準備中" }
  }
}

// export default function StoreDetail() {
//   const { id } = useParams()
//   const store = stores.find(s => s.id === id)
//   const [visitCount, setVisitCount] = useState(0)
//   const [isFavorite, setIsFavorite] = useState(false) //お気に入り判定
export default function StoreDetail() {
  const { id } = useParams()
  const store = stores.find(s => s.id === id)

  // localStorageから即時復元
  const [visitCount, setVisitCount] = useState(() => {
    const saved = localStorage.getItem(`visitCount_${id}`)
    return saved !== null ? parseInt(saved, 10) : 0
  })

  const [isFavorite, setIsFavorite] = useState(false)

  // ページ表示時にお気に入り状態を復元
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favs.includes(id))
  }, [id])

  // visitCount が変わるたび保存
  useEffect(() => {
    localStorage.setItem(`visitCount_${id}`, visitCount)
  }, [visitCount, id])

  if (!store) {
    return <div className="store-detail"><h1>店舗が見つかりませんでした</h1></div>
  }


  const status = getStatus(store)

  return (
    <div className="store-detail">
      {/* 店舗画像 */}
      <div className="store-image">
        <img src={store.image} alt={store.name} />
      </div>

      {/* 店舗名 + 営業状況 + お気に入り */}
      <div className="store-header">
        <h1>{store.name}</h1>
        <span className={`status-badge ${status.cls}`}>{status.text}</span>
        {/* お気に入りボタン */}
        <button
          className={`favorite-btn ${isFavorite ? "on" : ""}`}
          onClick={() => {
            const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
            let updatedFavs
            if (isFavorite) {
              // 解除
              updatedFavs = favs.filter(f => f !== store.id)
            } else {
              // 登録
              updatedFavs = [...favs, store.id]
            }
            localStorage.setItem("favorites", JSON.stringify(updatedFavs))
            setIsFavorite(!isFavorite)
          }}
        >
          {isFavorite ? "★ お気に入り済み" : "☆ お気に入り"}
        </button>
      </div>

      {/* 訪問回数ボタン */}
      <div className="visit-counter">
        <button onClick={() => setVisitCount(visitCount - 1)} disabled={visitCount <= 0}>⊖</button>
        <span>{visitCount} 回</span>
        <button onClick={() => setVisitCount(visitCount + 1)}>⊕</button>
      </div>

      {/* 住所 + アクセス */}
      <div className="detail-card">
        <h2>住所・アクセス</h2>
        <p>{store.address}</p>
        <p>{store.access}</p>
        <iframe
          src={`https://www.google.com/maps?q=${store.lat},${store.lng}&z=16&output=embed`}
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>

      {/* 営業時間 */}
      <div className="detail-card">
        <h2>営業時間</h2>
        <table className="hours-table">
          <tbody>
            {Object.entries(store.business_hours).map(([day, hours]) => (
              <tr key={day}>
                <td>{dayMap[day]}</td>
                <td>{hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {store.holidayNote && <p className="holiday">※{store.holidayNote}</p>}
      </div>

      {/* SNS */}
      <div className="detail-card">
        <h2>SNS</h2>
        <ul>
          {store.sns.twitter && <li><a href={store.sns.twitter} target="_blank" rel="noreferrer">Twitter</a></li>}
          {store.sns.instagram && <li><a href={store.sns.instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
          {store.sns.official && <li><a href={store.sns.official} target="_blank" rel="noreferrer">公式サイト</a></li>}
        </ul>
      </div>

      {/* メニュー */}
      <div className="detail-card">
        <h2>メニュー</h2>
        <ul>
          {store.menu.map((item, i) => (
            <li key={i}>{item.name} - {item.price}円</li>
          ))}
        </ul>
      </div>

      {/* その他 */}
      <div className="detail-card">
        <h2>その他</h2>
        <table className="info-table">
          <tbody>
            <tr><td>調味料</td><td>{store.seasonings.join("、")}</td></tr>
            <tr><td>レンゲ</td><td>{store.hasRenge ? "あり" : "なし"}</td></tr>
            <tr><td>茹で調整</td><td>{store.boilAdjustable ? "可能" : "不可"}</td></tr>
            <tr><td>駐車情報</td><td>{store.parkingInfo}</td></tr>
            {store.memo && <tr><td>メモ</td><td>{store.memo}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
