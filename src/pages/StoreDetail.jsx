import { useParams } from "react-router-dom"
import { useState } from "react"
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

export default function StoreDetail() {
  const { id } = useParams()
  const store = stores.find(s => s.id === id)
  const [visitCount, setVisitCount] = useState(0)

  if (!store) {
    return <div className="store-detail"><h1>店舗が見つかりませんでした</h1></div>
  }

  return (
    <div className="store-detail">
      {/* 店舗画像 */}
      <div className="store-image">
        <img src={store.image} alt={store.name} />
      </div>

      {/* 店舗名 + 営業状況 + お気に入り */}
      <div className="store-header">
        <h1>{store.name}</h1>
        <div className="store-actions">
          {/* 営業状況 */}
          <span className="status open">営業中</span>
          {/* お気に入りボタン */}
          <button className="fav-btn">☆ お気に入り</button>
        </div>
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
        {/* Google Map */}
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
        <p>調味料: {store.seasonings.join("、")}</p>
        <p>レンゲ: {store.hasRenge ? "あり" : "なし"}</p>
        <p>茹で調整: {store.boilAdjustable ? "可能" : "不可"}</p>
        <p>駐車情報: {store.parkingInfo}</p>
        {store.memo && <p>メモ: {store.memo}</p>}
      </div>
    </div>
  )
}
