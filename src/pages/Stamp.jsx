import { useState, useEffect } from "react";
import stores from "../data/stores.json";
import html2canvas from "html2canvas";
export default function Stamp() {
 const [visitCounts, setVisitCounts] = useState({});
 useEffect(() => {
   const counts = {};
   stores.forEach((s) => {
     const saved = localStorage.getItem(`visitCount_${s.id}`);
     counts[s.id] = saved ? parseInt(saved, 10) : 0;
   });
   setVisitCounts(counts);
 }, []);
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
     {/* 画面いっぱいに“カード”をフィットさせる器 */}
<div className="stamp-fit">
       {/* ← これが固定デザイン。これだけをスケールして1画面に収める */}
<div id="stampCard" className="stamp-card-wrapper" role="img" aria-label="二郎スタンプラリーカード">
<h1 className="stamp-title">
<span>ラーメン</span>二郎 スタンプラリー
</h1>
<p className="stamp-note">
           訪問した店舗は<strong>黄色</strong>に光り、右上に<strong>回数</strong>が出ます。
</p>
<div className="stamp-grid">
           {stores.map((s) => {
             const count = visitCounts[s.id] || 0;
             const visited = count > 0;
             return (
<div key={s.id} className={`stamp-card ${visited ? "visited" : ""}`}>
<div className="store-name">
  {s.name.length > 5
    ? s.name.slice(0, 5) + "\n" + s.name.slice(5)
    : s.name}
</div>
      {visited && <div className="visit-badge">{count}</div>}
</div>
             );
           })}
           {/* 足りない分はダミーで埋めて8x6の形を維持 */}
           {placeholders.map((_, i) => (
<div key={`ph-${i}`} className="stamp-card placeholder" aria-hidden />
           ))}
</div>
<div className="stamp-footer">
<div className="footer-field"><span>発行日：</span></div>
<div className="footer-field"><span>NAME：</span></div>
</div>
</div>
</div>
<div className="stamp-actions">
<button onClick={handleCapture} className="capture-btn">📸 保存 / 共有</button>
</div>
</div>
 );
}