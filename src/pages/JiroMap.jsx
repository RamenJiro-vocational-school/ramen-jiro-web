import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import stores from "../data/stores.json";

export default function JiroMap() {
  const [locations, setLocations] = useState([]);
  const provider = new OpenStreetMapProvider();

  // 初回ロード時に住所から緯度経度を取得
  useEffect(() => {
    async function fetchCoords() {
      const results = await Promise.all(
        stores.map(async (store) => {
          try {
            // Google Map URLから緯度経度を抽出
            const match = store.map_url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
              return {
                ...store,
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
              };
            }

            // map_urlに緯度経度がなければ住所から検索（自動変換）
            const res = await provider.search({ query: store.address });
            if (res && res.length > 0) {
              const { x, y } = res[0];
              return { ...store, lat: y, lng: x };
            }
            return null;
          } catch (e) {
            console.error("Failed to fetch:", store.name, e);
            return null;
          }
        })
      );

      setLocations(results.filter(Boolean));
    }

    fetchCoords();
  }, []);

  // ニンニクピン設定
  const icon = L.icon({
    iconUrl: "/images/icon/garlic.png",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
  });

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "10px" }}>
      <MapContainer
        center={[35.68, 139.76]} // 東京中心
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {locations.map((store, idx) => (
          <Marker key={idx} position={[store.lat, store.lng]} icon={icon}>
            <Popup>
              <b>{store.name}</b>
              <br />
              <a href={store.url} target="_blank" rel="noreferrer">
                店舗ページへ →
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
