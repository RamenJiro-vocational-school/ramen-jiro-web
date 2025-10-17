import stores from '../data/stores.json'
import logo from '../assets/title_01.png'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'


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
  const [activeFilters, setActiveFilters] = useState([]);

  // ハンバーガーアイコン開閉状態を管理
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null);

  // 外クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // --- localStorage からお気に入りを常に同期する ---
  useEffect(() => {
    const syncFavorites = () => {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
      setFavorites(favs)
    }

    // 初回実行
    syncFavorites()

    // storage イベントで他タブや別ページからの更新にも対応
    window.addEventListener("storage", syncFavorites)

    return () => {
      window.removeEventListener("storage", syncFavorites)
    }
  }, [])


  const filteredStores = stores.filter(s => {
    const inFav = favorites.includes(s.id);
    const inRegion = activeFilters.includes(s.area);

    // 1. フィルタが空なら全部表示
    if (activeFilters.length === 0) return true;

    // 2. お気に入りフィルタが有効な場合（お気に入りじゃない店舗は除外）
    if (activeFilters.includes("お気に入り") && !inFav) {
      return false;
    }

    // 3. 地域フィルタが有効な場合（地域に含まれない店舗は除外）
    const hasRegionFilter = activeFilters.some(f => f !== "お気に入り");
    if (hasRegionFilter && !inRegion) {
      return false;
    }

    return true;
  });
return (
    <div>
      {/* ✅ ③ ハンバーガーメニューとメニューリスト */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {menuOpen && (
        <div className="menu" ref={menuRef}>
          <button onClick={() => { setMenuOpen(false); navigate("/"); }}>🏠 ホーム</button>
          <button onClick={() => { setMenuOpen(false); navigate("/Stamp"); }}>🏅 スタンプラリー</button>
          <button onClick={() => { setMenuOpen(false); navigate("/diary"); }}>📝 二郎ログ</button>
          <button onClick={() => { setMenuOpen(false); navigate("/map"); }}>🗾 二郎全国マップ</button>
        </div>
      )}

      {/* ロゴ部分 */}
      <div className="logo-header">
        <img src={logo} alt="ラーメン二郎データベース" className="logo" />
      </div>

      {/* フィルタバー */}
      <div className="filter-bar">
        {["北日本", "東京都", "埼玉県", "神奈川", "千葉県", "北関東", "西日本"].map(region => (
          <button
            key={region}
            className={`filter-btn ${activeFilters.includes(region) ? "active" : ""}`}
            onClick={() => {
              setActiveFilters(prev =>
                prev.includes(region)
                  ? prev.filter(r => r !== region)
                  : [...prev, region]
              )
            }}
          >
            {region}
          </button>
        ))}

        {/* お気に入りボタン */}
        <button
          className={`filter-btn ${activeFilters.includes("お気に入り") ? "active" : ""}`}
          onClick={() => {
            setActiveFilters(prev =>
              prev.includes("お気に入り")
                ? prev.filter(r => r !== "お気に入り")
                : [...prev, "お気に入り"]
            )
          }}
        >
          ★
        </button>
      </div>

      {/* 店舗カード一覧 */}
      <div className="store-grid">
        {filteredStores.map((s, i) => {
          const { cls, text } = getStatusClass(s)
          const isFav = favorites.includes(s.id)

          return (
            <div
              key={i}
              className={`store-card ${cls}`}
              onClick={() => navigate(`/store/${s.id}`)}
            >
              {isFav && <div className="fav-star">★</div>}
              <div className="store-name">{s.name}</div>
              <div className="store-hours">{text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}