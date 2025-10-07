import { useState, useEffect } from "react";
import { openDB } from "idb";
import stores from "../data/stores.json";

export default function VisitDiary() {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({
    date: "",
    store: "",
    menu: "",
    call: "",
    memo: "",
    photos: [],
  });

  // --- IndexedDB 初期化 ---
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("jiroDiaryDB", 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("visitRecords")) {
            db.createObjectStore("visitRecords", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        },
      });

      const all = await db.getAll("visitRecords");
      setRecords(all);
    };
    initDB();
  }, []);

  // --- 写真アップロード ---
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // 最大3枚
    setNewRecord({ ...newRecord, photos: files });
  };

  // --- 保存 ---
  const saveRecord = async () => {
    if (!newRecord.date || !newRecord.store) {
      alert("日付と店舗名は必須です！");
      return;
    }

    const db = await openDB("jiroDiaryDB", 2);
    const record = { ...newRecord, id: Date.now() };

    await db.add("visitRecords", record);

    const updated = [...records, record];
    setRecords(updated);
    setShowModal(false);
    setNewRecord({
      date: "",
      store: "",
      menu: "",
      call: "",
      memo: "",
      photos: [],
    });
  };

  // --- 削除 ---
  const deleteRecord = async (id) => {
    const db = await openDB("jiroDiaryDB", 2);
    await db.delete("visitRecords", id);
    setRecords(records.filter((r) => r.id !== id));
  };

  // --- Blob → URL変換 ---
  const getPhotoURLs = (record) => {
    if (!record.photos) return [];
    return record.photos
      .filter((p) => p instanceof Blob || p instanceof File)
      .map((blob) => URL.createObjectURL(blob));
  };

  // --- カルーセル操作 ---
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = (photos) => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };
  const prevPhoto = (photos) => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // --- 詳細モーダルを開く ---
  const openDetailModal = (record) => {
    setSelectedRecord(record);
    setCurrentIndex(0);
  };

  // --- 詳細モーダルを閉じる ---
  const closeDetailModal = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="diary-container">
      {/* 🐷 記録ボタン */}
      <div>
        <img
          src="/images/icon/log.png"
          alt="記録する"
          className="log-button"
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* モーダル（新規登録） */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>訪問記録を追加</h2>

            <label>日付</label>
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) =>
                setNewRecord({ ...newRecord, date: e.target.value })
              }
            />

            <label>店舗</label>
            <select
              value={newRecord.store}
              onChange={(e) =>
                setNewRecord({ ...newRecord, store: e.target.value })
              }
            >
              <option value="">選択してください</option>
              {stores.map((s, i) => (
                <option key={i} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <label>写真（最大3枚）</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
            />

            {/* プレビュー */}
            <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
              {newRecord.photos.map((file, i) => {
                const preview = URL.createObjectURL(file);
                return (
                  <img
                    key={i}
                    src={preview}
                    alt={`preview-${i}`}
                    width="60"
                    height="60"
                    style={{
                      borderRadius: "6px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />
                );
              })}
            </div>

            <label>メニュー</label>
            <input
              type="text"
              placeholder="例：小ラーメン ブタ入り"
              value={newRecord.menu}
              onChange={(e) =>
                setNewRecord({ ...newRecord, menu: e.target.value })
              }
            />

            <label>コール</label>
            <input
              type="text"
              placeholder="例：ニンニクマシマシアブラ"
              value={newRecord.call}
              onChange={(e) =>
                setNewRecord({ ...newRecord, call: e.target.value })
              }
            />

            <label>感想</label>
            <textarea
              placeholder="今日はブタが神だった…"
              value={newRecord.memo}
              onChange={(e) =>
                setNewRecord({ ...newRecord, memo: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={saveRecord}>記録する</button>
              <button onClick={() => setShowModal(false)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* 📸 詳細モーダル（カルーセルつき） */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // 背景クリックで閉じる
          >
            <h2>{selectedRecord.store}</h2>
            <p>{selectedRecord.date}</p>

            {/* カルーセル */}
            <div className="carousel-container">
              {selectedRecord.photos.length > 0 && (
                <>
                  <img
                    src={URL.createObjectURL(
                      selectedRecord.photos[currentIndex]
                    )}
                    alt="photo"
                    className="carousel-photo"
                  />
                  {selectedRecord.photos.length > 1 && (
                    <div className="carousel-buttons">
                      <button onClick={() => prevPhoto(selectedRecord.photos)}>
                        ◀
                      </button>
                      <button onClick={() => nextPhoto(selectedRecord.photos)}>
                        ▶
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <p>メニュー：{selectedRecord.menu}</p>
            <p>コール：{selectedRecord.call}</p>
            <p>感想：{selectedRecord.memo}</p>

            <div className="modal-buttons">
              <button onClick={closeDetailModal}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* 一覧 */}
      <div className="diary-list">
        {records.map((r) => {
          const urls = getPhotoURLs(r);
          return (
            <div
              key={r.id}
              className="diary-card"
              onClick={() => openDetailModal(r)}
              style={{ cursor: "pointer" }}
            >
              {urls[0] && (
                <img src={urls[0]} alt={r.store} className="diary-thumb" />
              )}
              <h3>{r.store}</h3>
              <p>{r.date}</p>
              <p>{r.menu}</p>
              <button
                style={{
                  background: "#ffaaaa",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  marginTop: "6px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRecord(r.id);
                }}
              >
                🗑️ 削除
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
