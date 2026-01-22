import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { type Business } from '../../services/businesses'
import { Link } from 'react-router-dom'

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

interface GrensMapProps {
    businesses: Business[]
}

export default function GrensMap({ businesses }: GrensMapProps) {
    // Focus op Emmerich/Elten regio
    const centerPosition: [number, number] = [51.85, 6.20]

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                center={centerPosition}
                zoom={12} // Iets meer ingezoomd voor deze regio
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {businesses.map((business) => (
                    business.latitude && business.longitude ? (
                        <Marker
                            key={business.id}
                            position={[Number(business.latitude), Number(business.longitude)]}
                        >
                            <Popup>
                                <strong>{business.name}</strong><br />
                                {business.category}
                                {business.cuisine_type && ` - ${business.cuisine_type}`}<br />
                                {business.address}, {business.city}<br />
                                {business.phone && <small>📞 {business.phone}</small>}
                                <Link to={`/business/${business.id}`} style={{display: 'block', marginTop: '5px', color: '#007bff'}}>
                                    Meer info
                                </Link>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    )
}