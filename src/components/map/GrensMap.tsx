import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { businessService, type Business } from '../../services/businesses'

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
    const [businesses, setBusinesses] = useState<Business[]>([])
    // Focus op Emmerich/Elten regio
    const centerPosition: [number, number] = [51.85, 6.20]

    useEffect(() => {
        const fetchBusinesses = async () => {
            const { data } = await businessService.getAll()
            if (data) {
                setBusinesses(data)
            }
        }

        fetchBusinesses()
    }, [])

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
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    )
}