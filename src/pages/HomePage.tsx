import GrensMap from '../components/map/GrensMap.tsx'

export default function HomePage() {
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1>🇩🇪 Grensgebied Voordeel 🇳🇱</h1>
                <p>Ontdek de beste winkels, restaurants en tankstations net over de grens.</p>
            </header>

            <div style={{ marginBottom: '40px' }}>
                <GrensMap />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {/* Placeholder categorieën */}
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>🛒 Supermarkten</h3>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>⛽ Tankstations</h3>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>🍽️ Restaurants</h3>
                </div>
            </div>
        </div>
    )
}
