import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function AdminMap() {

  // 🔹 Temporary demo data
  const markers = [
    { id: 1, type: "CASE", name: "Case A", lat: 28.6139, lng: 77.2090 }, // Delhi
    { id: 2, type: "LAWYER", name: "Lawyer X", lat: 19.0760, lng: 72.8777 }, // Mumbai
    { id: 3, type: "NGO", name: "NGO Hope", lat: 12.9716, lng: 77.5946 }, // Bangalore
  ];

  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">
        🌍 Geographic Distribution
      </h2>

      <MapContainer
        center={[22.9734, 78.6569]} // Center of India
        zoom={5}
        style={{ height: "350px", width: "100%", borderRadius: "12px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.name}</strong>
              <br />
              Type: {m.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default AdminMap;
