import { useState, useEffect } from "react";
import stores from "../data/stores.json";

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

  return (
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
            {visited && (
              <div className="visit-badge">{count}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
