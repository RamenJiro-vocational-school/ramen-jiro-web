import stores from '../data/stores.json'
import '../style.css'

export default function Home() {
  return (
    <div className="home-container">
      {/* ---- ロゴ ---- */}
      <header className="logo-header">
        <img src="/images/title_01.png" alt="ラーメン二郎データベース ロゴ" className="logo" />
      </header>

      {/* ---- 店舗一覧 ---- */}
      <section className="store-list">
        {stores.map((s) => (
          <div key={s.name} className="store-card">
            <h3>{s.name}</h3>
            <p>{s.area}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
