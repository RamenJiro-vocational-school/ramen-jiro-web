import { useState, useEffect } from "react";
import stores from "../data/stores.json";
import html2canvas from "html2canvas";

console.log("Stamp.jsx 読み込みOK");

export default function Stamp() {
  const [visitCounts, setVisitCounts] = useState({});
  const [userName, setUserName] = useState(""); // ← 追加
  const [issueDate, setIssueDate] = useState(""); // ← 追加

  useEffect(() => {
    const counts = {};
    stores.forEach((s) => {
      const saved = localStorage.getItem(`visitCount_${s.id}`);
      counts[s.id] = saved ? parseInt(saved, 10) : 0;
    });
    setVisitCounts(counts);
  }, []);

  // 合計店舗数と訪問済店舗数を算出
  const totalStores = stores.length;
  const totalVisited = Object.values(visitCounts).filter((v) => v > 0).length;

  // 44店舗を8x6に載せるための空白（48-44=4）
  const placeholders = Array.from({ length: Math.max(0, 48 - stores.length) });

  const handleCapture = () => {
    const el = document.getElementById("stampCard");
    html2canvas(el, { scale: 2, useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "jiro_stamp.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="stamp-container">
      <div className="stamp-fit">
        <div id="stampCard" className="stamp-card-wrapper">

          {/* タイトル（枠内） */}
          <div className="stamp-header">
            <h1 className="stamp-title">
              <span className="title-black">ラーメン二郎</span>
              <span className="title-red">訪問記録</span>
            </h1>
            <p className="stamp-note">
              {totalStores}店舗中<strong>{totalVisited}</strong>店舗に訪問済
            </p>
          </div>

          {/* スタンプ一覧 */}
          <div className="stamp-grid">
            {stores.map((s) => {
              const count = visitCounts[s.id] || 0;
              const visited = count > 0;
              return (
                <div key={s.id} className={`stamp-card ${visited ? "visited" : ""}`}>
                  <div className="store-name">
                    {s.name.length > 5 ? (
                      <>
                        {s.name.slice(0, 5)}<br />
                        {s.name.slice(5)}
                      </>
                    ) : (
                      s.name
                    )}
                  </div>
                  {visited && <div className="visit-badge">{count}</div>}
                </div>
              );
            })}
            {placeholders.map((_, i) => (
              <div key={`ph-${i}`} className="stamp-card placeholder" aria-hidden />
            ))}
          </div>

          {/* 名前・発行日（枠内下部） */}
          <div className="stamp-footer">
            <div className="footer-left">
              名前：<span className="footer-underline">{userName || "　"}</span>
            </div>
            <div className="footer-right">
              日付：<span className="footer-underline">{issueDate || "　"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 入力欄（枠外） */}
      <div className="stamp-inputs">
        <div className="input-group">
          <label htmlFor="userName">名前：</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="ジロリアン太郎"
          />
        </div>

        <div className="input-group">
          <label htmlFor="issueDate">日付：</label>
          <input
            type="date"
            id="issueDate"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
      </div>

      {/* 共有ボタン */}
      <div className="stamp-actions">
        <button onClick={handleCapture} className="capture-btn">
          📸 保存 / 共有
        </button>
      </div>
    </div>
  );
}
