import stores from '../data/stores.json';
import logo from '../assets/title_01.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

// 営業ステータス判定（任意時刻対応）
function getStatusClass(store, selectedDateTime = null) {
  const now = selectedDateTime ? new Date(selectedDateTime) : new Date();
  const today = now.getDay() === 0 ? 7 : now.getDay();
  const timeStr = now.toTimeString().slice(0, 5);

  if (!store.openDays.includes(today)) return { cls: 'closed', text: '' };
  const hours = store.business_hours?.[today];
  if (!hours) return { cls: 'closed', text: '' };

  const ranges = hours.split(',').map((r) => r.trim());
  const inRange = ranges.some((range) => {
    const [start, end] = range.split('-');
    return timeStr >= start && timeStr <= end;
  });
  return inRange ? { cls: 'open', text: hours } : { cls: 'break', text: hours };
}

export default function Home() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clockOpen, setClockOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [displayTimeLabel, setDisplayTimeLabel] = useState('');
  const menuRef = useRef(null);
  const clockRef = useRef(null);

  // 外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (clockRef.current && !clockRef.current.contains(event.target))
      ) {
        setMenuOpen(false);
        setClockOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // localStorage 同期
  useEffect(() => {
    const syncFavorites = () => {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(favs);
    };
    syncFavorites();
    window.addEventListener('storage', syncFavorites);
    return () => window.removeEventListener('storage', syncFavorites);
  }, []);

  // 任意時刻入力処理
  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDateTime(value);
    if (value) {
      const date = new Date(value);
      const label = `${date.getMonth() + 1}月${date.getDate()}日 ${String(
        date.getHours()
      ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} 時点の営業一覧`;
      setDisplayTimeLabel(label);
    } else {
      setDisplayTimeLabel('');
    }
  };

  const resetToNow = () => {
    setSelectedDateTime('');
    setDisplayTimeLabel('');
  };

  // フィルタ
  const filteredStores = stores.filter((s) => {
    const inFav = favorites.includes(s.id);
    const inRegion = activeFilters.includes(s.area);
    if (activeFilters.length === 0) return true;
    if (activeFilters.includes('お気に入り') && !inFav) return false;
    const hasRegionFilter = activeFilters.some((f) => f !== 'お気に入り');
    if (hasRegionFilter && !inRegion) return false;
    return true;
  });

  return (
    <div>
      {/* オリジナル時計アイコン */}
      <div className="clock-icon" onClick={() => setClockOpen(!clockOpen)}>
        <img
          src="/images/icon/clock_icon.png"
          alt="営業時間指定"
          className="clock-img"
        />
      </div>

      {/* ポップアップ */}
      {clockOpen && (
        <div className="clock-menu" ref={clockRef}>
          <label>任意の日時を選択：</label>
          <input type="datetime-local" value={selectedDateTime} onChange={handleDateChange} />
          <button onClick={resetToNow}>現在時刻に戻す</button>
        </div>
      )}

      {/* ☰ ハンバーガー */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {menuOpen && (
        <div className="menu" ref={menuRef}>
          <button onClick={() => { setMenuOpen(false); navigate('/'); }}>🏠 ホーム</button>
          <button onClick={() => { setMenuOpen(false); navigate('/Stamp'); }}>🏅 スタンプラリー</button>
          <button onClick={() => { setMenuOpen(false); navigate('/diary'); }}>📝 二郎ログ</button>
          <button onClick={() => { setMenuOpen(false); navigate('/map'); }}>🗾 二郎全国マップ</button>
        </div>
      )}

      {/* ロゴ */}
      <div className="logo-header">
        <img src={logo} alt="ラーメン二郎データベース" className="logo" />
      </div>

      {/* 時間ラベル */}
      {displayTimeLabel && <p className="time-label">{displayTimeLabel}</p>}

      {/* 地域フィルタ */}
      <div className="filter-bar">
        {['北日本', '東京都', '埼玉県', '神奈川', '千葉県', '北関東', '西日本'].map((region) => (
          <button
            key={region}
            className={`filter-btn ${activeFilters.includes(region) ? 'active' : ''}`}
            onClick={() => {
              setActiveFilters((prev) =>
                prev.includes(region)
                  ? prev.filter((r) => r !== region)
                  : [...prev, region]
              );
            }}
          >
            {region}
          </button>
        ))}
        <button
          className={`filter-btn ${activeFilters.includes('お気に入り') ? 'active' : ''}`}
          onClick={() => {
            setActiveFilters((prev) =>
              prev.includes('お気に入り')
                ? prev.filter((r) => r !== 'お気に入り')
                : [...prev, 'お気に入り']
            );
          }}
        >
          ★
        </button>
      </div>

      {/* 店舗リスト */}
      <div className="store-grid">
        {filteredStores.map((s, i) => {
          const { cls, text } = getStatusClass(s, selectedDateTime);
          const isFav = favorites.includes(s.id);
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
          );
        })}
      </div>
    </div>
  );
}
