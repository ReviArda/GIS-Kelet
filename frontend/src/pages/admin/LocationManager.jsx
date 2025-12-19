import { useState, useEffect } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../../services/api';
import { Trash2, MapPin, Layers, Plus, Edit } from 'lucide-react';

export default function LocationManager() {
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState('list'); // list | form
    const [formType, setFormType] = useState('marker'); // marker | boundary
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: '',
        category: 'dusun',
        lat: '',
        lng: '',
        geojson: '',
        description: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await getLocations();
            if (res.data.status) setLocations(res.data.data);
        } catch (err) {
            console.error("Failed to fetch locations", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus data ini?')) {
            await deleteLocation(id);
            fetchLocations();
        }
    };

    const handleEdit = (loc) => {
        setEditingId(loc.id);
        setFormType(loc.category === 'boundary' ? 'boundary' : 'marker');
        setForm({
            name: loc.name,
            category: loc.category,
            lat: loc.lat || '',
            lng: loc.lng || '',
            geojson: loc.geojson || '',
            description: loc.description || ''
        });
        setView('form');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateLocation(editingId, form);
                alert('Data berhasil diperbarui!');
            } else {
                await createLocation(form);
                alert('Data berhasil disimpan!');
            }
            resetForm();
            fetchLocations();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan data. Pastikan semua field terisi benar.');
        }
    };

    const resetForm = () => {
        setForm({ name: '', category: 'dusun', lat: '', lng: '', geojson: '', description: '' });
        setEditingId(null);
        setView('list');
    }

    const openForm = (type) => {
        resetForm(); // Ensure clean state
        setFormType(type);
        setForm(prev => ({
            ...prev,
            category: type === 'boundary' ? 'boundary' : 'dusun'
        }));
        setView('form');
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Filter locations
    const markers = locations.filter(l => l.category !== 'boundary');
    const boundaries = locations.filter(l => l.category === 'boundary');

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Manajemen Data GIS</h2>
            </div>

            {view === 'form' ? (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-3xl mx-auto animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">
                            {editingId ? 'Edit Data' : (formType === 'boundary' ? 'Tambah Batas Wilayah' : 'Tambah Fasilitas')}
                        </h3>
                        <button onClick={resetForm} className="text-sm text-slate-500 hover:text-red-500">Batal</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lokasi</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Contoh: Balai Desa" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                                    {formType === 'boundary' ? (
                                        <input type="text" value="Batas Wilayah (Polygon)" disabled className="w-full px-4 py-2 bg-slate-100 border rounded-lg text-slate-500 cursor-not-allowed" />
                                    ) : (
                                        <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                            <option value="dusun">Dusun</option>
                                            <option value="sekolah">Sekolah</option>
                                            <option value="faskes">Fasilitas Kesehatan</option>
                                            <option value="kantor">Kantor Pemerintahan</option>
                                            <option value="ibadah">Tempat Ibadah</option>
                                            <option value="umkm">UMKM</option>
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit">
                                {formType === 'boundary' ? (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">Data GeoJSON</label>
                                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mb-2">
                                            Copy GeoJSON dari <b>geojson.io</b> dan paste di bawah ini.
                                        </div>
                                        <textarea name="geojson" value={form.geojson} onChange={handleChange} required rows={6} className="w-full px-4 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-primary outline-none bg-white" placeholder='{ "type": "Feature", ... }'></textarea>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                                            <MapPin size={16} className="text-primary" />
                                            <span className="font-semibold text-slate-700">Koordinat Lokasi</span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Latitude</label>
                                            <input type="text" name="lat" value={form.lat} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="-6.xxxxx" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Longitude</label>
                                            <input type="text" name="lng" value={form.lng} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="110.xxxxx" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-end gap-3">
                            <button type="button" onClick={resetForm} className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">Batal</button>
                            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition shadow-lg shadow-primary/30">
                                {editingId ? 'Simpan Perubahan' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Section 1: Fasilitas / Marker */}
                    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-primary">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Daftar Fasilitas & Lokasi</h3>
                                    <p className="text-slate-500 text-xs">Lokasi fasilitas umum, kantor, dan tempat penting lainnya.</p>
                                </div>
                            </div>
                            <button onClick={() => openForm('marker')} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-primary-dark transition shadow-md shadow-primary/20">
                                <Plus size={16} /> Tambah Fasilitas
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Nama Lokasi</th>
                                        <th className="p-4">Kategori</th>
                                        <th className="p-4">Koordinat</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {markers.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Belum ada data fasilitas.</td></tr>
                                    ) : (
                                        markers.map(loc => (
                                            <tr key={loc.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                <td className="p-4 font-medium text-slate-800">{loc.name}</td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200 capitalize">
                                                        {loc.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-500 font-mono text-xs">{loc.lat}, {loc.lng}</td>
                                                <td className="p-4 text-center flex justify-center gap-2">
                                                    <button onClick={() => handleEdit(loc)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(loc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 2: Batas Wilayah / Polygon */}
                    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Batas Wilayah Desa</h3>
                                    <p className="text-slate-500 text-xs">Data polygon batas wilayah dusun atau desa (GeoJSON).</p>
                                </div>
                            </div>
                            <button onClick={() => openForm('boundary')} className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow-md shadow-purple-600/20">
                                <Plus size={16} /> Tambah Batas
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Nama Wilayah</th>
                                        <th className="p-4">Status Data</th>
                                        <th className="p-4">Deskripsi</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boundaries.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Belum ada data batas wilayah.</td></tr>
                                    ) : (
                                        boundaries.map(loc => (
                                            <tr key={loc.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                <td className="p-4 font-medium text-slate-800">{loc.name}</td>
                                                <td className="p-4">
                                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                                        <Layers size={12} /> GeoJSON Active
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-500 text-sm max-w-xs truncate">{loc.description || '-'}</td>
                                                <td className="p-4 text-center flex justify-center gap-2">
                                                    <button onClick={() => handleEdit(loc)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(loc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
