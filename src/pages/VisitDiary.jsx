import { useState, useEffect } from "react";
import stores from "../data/stores.json";

export default function VisitDiary() {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: "",
    store: "",
    menu: "",
    call: "",
    memo: "",
    photos: [],
  });

  // LocalStorageから読み込み
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("visitRecords") || "[]");
    setRecords(saved);
  }, []);

  // 保存処理
  const saveRecord = () => {
    if (!newRecord.date || !newRecord.store) {
      alert("日付と店舗名は必須です！");
      return;
    }
    const updated = [...records, { ...newRecord, id: Date.now() }];
    setRecords(updated);
    localStorage.setItem("visitRecords", JSON.stringify(updated));
    setShowModal(false);
    setNewRecord({ date: "", store: "", menu: "", call: "", memo: "", photos: [] });
  };

  // 写真選択処理
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setNewRecord({ ...newRecord, photos: urls });
  };

  return (
    <div className="diary-container">
      {/* 日記アイコン（右上） */}
      <div className="log-button"> 
        <img
        src="/images/log.png"
        alt="記録する"
        className="log-button"
        onClick={() => setShowModal(true)}
      />
      </div>

      {/* モーダル部分 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>訪問記録を追加</h2>

            <label>日付</label>
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
            />

            <label>店舗</label>
            <select
              value={newRecord.store}
              onChange={(e) => setNewRecord({ ...newRecord, store: e.target.value })}
            >
              <option value="">選択してください</option>
              {stores.map((s, i) => (
                <option key={i} value={s.name}>{s.name}</option>
              ))}
            </select>

            <label>写真</label>
            <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />

            <label>メニュー</label>
            <input
              type="text"
              placeholder="例：小ラーメン ブタ入り"
              value={newRecord.menu}
              onChange={(e) => setNewRecord({ ...newRecord, menu: e.target.value })}
            />

            <label>コール</label>
            <input
              type="text"
              placeholder="例：ニンニクマシマシアブラ"
              value={newRecord.call}
              onChange={(e) => setNewRecord({ ...newRecord, call: e.target.value })}
            />

            <label>感想</label>
            <textarea
              placeholder="今日はブタが神だった…"
              value={newRecord.memo}
              onChange={(e) => setNewRecord({ ...newRecord, memo: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={saveRecord}>記録する</button>
              <button onClick={() => setShowModal(false)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* 一覧表示（最低限） */}
      <div className="diary-list">
        {records.map((r) => (
          <div key={r.id} className="diary-card">
            {r.photos[0] && <img src={r.photos[0]} alt={r.store} className="diary-thumb" />}
            <h3>{r.store}</h3>
            <p>{r.date} / {r.menu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
