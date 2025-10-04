import { useState, useEffect } from "react";
import stores from "../data/stores.json";
import html2canvas from "html2canvas";

export default function Stamp() {
  const [visitCounts, setVisitCounts] = useState({});

  useEffect(() => {
    // localStorage から全店舗の訪問回数を復元
    const counts = {};
    stores.forEach((s) => {
      const saved = localStorage.getItem(`visitCount_${s.id}`);
      counts[s.id] = saved ? parseInt(saved, 10) : 0;
    });
    setVisitCounts(counts);
  }, []);

  const handleCapture = () => {
    const element = document.querySelector(".stamp-grid");
    html2canvas(element).then(canvas => {
      const link = document.createElement("a");
      link.download = "jiro_stamp.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="stamp-container">
      <button onClick={handleCapture} className="capture-btn">
        📸 スタンプラリーを保存
      </button>

      <div className="stamp-grid">
        {stores.map((s) => {
          const count = visitCounts[s.id] || 0;
          const visited = count > 0;

          return (
            <div
              key={s.id}
              className={`stamp-card ${visited ? "visited" : ""}`}
            >
              <div className="store-name">{s.name}</div>
              {visited && <div className="visit-badge">{count}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
