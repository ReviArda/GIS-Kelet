import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocations } from '../services/api';
// Fix Leaflet Default Icon Issue in React with robust imports
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Building2, GraduationCap, Hospital, Store, MoonStar, MapPin } from 'lucide-react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Auto-Zoom Component
const AutoZoom = ({ locations }) => {
    const map = useMap();

    useEffect(() => {
        if (!locations.length) return;

        const boundary = locations.find(l => l.category === 'boundary' && l.geojson);
        if (boundary) {
            try {
                const geoData = JSON.parse(boundary.geojson);
                const layer = L.geoJSON(geoData);
                const bounds = layer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            } catch (e) {
                console.error("Invalid GeoJSON for zoom", e);
            }
        }
    }, [locations, map]);

    return null;
};

// Default Fallback
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons Generator using DivIcon + Lucide
const createCustomIcon = (IconComponent, colorClass) => {
    const iconHtml = renderToStaticMarkup(
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${colorClass}`}>
            <IconComponent size={18} className="text-white" />
        </div>
    );

    return new L.DivIcon({
        html: iconHtml,
        className: 'custom-leaflet-icon', // To remove default square background if needed
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const icons = {
    default: DefaultIcon,
    kantor: createCustomIcon(Building2, 'bg-red-500'),
    sekolah: createCustomIcon(GraduationCap, 'bg-green-600'),
    faskes: createCustomIcon(Hospital, 'bg-pink-500'),
    ibadah: createCustomIcon(MoonStar, 'bg-violet-600'),
    umkm: createCustomIcon(Store, 'bg-orange-500'),
    boundary: DefaultIcon // Boundaries don't use markers usually, but fallback if needed
};

export default function MapPage() {
    const [locations, setLocations] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLocations();
                if (res.data.data) {
                    setLocations(res.data.data);
                }
            } catch (e) {
                console.error("Failed to fetch locations", e);
            }
        };
        fetchData();
    }, []);

    const filteredLocations = filter === 'all'
        ? locations
        : locations.filter(loc => loc.category === filter);

    // Center on Kelet area (Approximate)
    const position = [-6.550, 110.750];

    return (
        <div className="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row">
            {/* Sidebar Filter */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto z-10 shadow-lg md:shadow-none">
                <h2 className="font-bold text-lg mb-4 text-slate-800">Filter Peta</h2>
                <div className="space-y-2">
                    {['all', 'kantor', 'sekolah', 'faskes', 'ibadah', 'umkm', 'boundary'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`w-full text-left px-4 py-2 rounded-lg capitalize transition ${filter === cat ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {cat === 'all' ? 'Semua Kategori' : cat === 'boundary' ? 'Batas Wilayah' : cat}
                        </button>
                    ))}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                    <h3 className="font-semibold text-sm text-slate-500 mb-3 uppercase tracking-wider">Legenda</h3>
                    <div className="text-sm text-slate-600 space-y-3">
                        <div className="flex items-center gap-3"><div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><Building2 size={12} className="text-white" /></div> Kantor Desa</div>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"><GraduationCap size={12} className="text-white" /></div> Sekolah</div>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"><Hospital size={12} className="text-white" /></div> Fasilitas Kesehatan</div>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center"><MoonStar size={12} className="text-white" /></div> Tempat Ibadah</div>
                        <div className="flex items-center gap-3"><div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center"><Store size={12} className="text-white" /></div> UMKM</div>
                        <div className="flex items-center gap-3"><span className="w-5 h-5 border-2 border-primary bg-primary/20 rounded"></span> Batas Wilayah</div>
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="flex-1 relative z-0">
                <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <AutoZoom locations={locations} />
                    {filteredLocations.map(loc => {
                        // Handle Polygon/GeoJSON
                        if (loc.category === 'boundary' && loc.geojson) {
                            try {
                                const geoData = JSON.parse(loc.geojson);
                                return (
                                    <GeoJSON
                                        key={`geo-${loc.id}`}
                                        data={geoData}
                                        style={{ color: '#10b981', weight: 2, fillOpacity: 0.1, dashArray: '5, 5' }}
                                    >
                                        <Popup>{loc.name}</Popup>
                                    </GeoJSON>
                                );
                            } catch (e) { return null; }
                        }
                        // Handle Markers
                        else if (loc.lat && loc.lng) {
                            return (
                                <Marker
                                    key={`market-${loc.id}`}
                                    position={[loc.lat, loc.lng]}
                                    icon={icons[loc.category] || icons.default}
                                >
                                    <Popup>
                                        <div className="p-1 min-w-[200px]">
                                            <h3 className="font-bold text-slate-900 border-b pb-1 mb-2">{loc.name}</h3>
                                            <span className="text-[10px] tracking-wider font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{loc.category}</span>
                                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{loc.description}</p>
                                            {loc.image && (
                                                <img src={loc.image} alt={loc.name} className="mt-2 rounded-lg w-full h-32 object-cover" />
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        }
                        return null;
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
