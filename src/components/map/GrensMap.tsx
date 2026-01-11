import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix voor Leaflet icon bug in React
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function GrensMap() {
    // Coördinaten voor centrum grensgebied (ongeveer Arnhem/Nijmegen hoogte)
    const centerPosition: [number, number] = [51.9, 6.2]

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                center={centerPosition}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Voorbeeld marker (Gronau) */}
                <Marker position={[52.21, 7.02]}>
                    <Popup>
                        <b>Winkelcentrum Gronau</b><br />
                        Hier kun je goedkoop tanken!
                    </Popup>
                </Marker>

                {/* Voorbeeld marker (Kleve) */}
                <Marker position={[51.78, 6.13]}>
                    <Popup>
                        <b>Restaurant Der Grieche</b><br />
                        Beste gyros in de regio.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
