import { useState } from 'react';
import { createServiceRequest, searchService } from '../services/api';
import { CheckCircle, AlertCircle, Search, FileText, Info } from 'lucide-react';

const SERVICE_REQUIREMENTS = {
    'surat_pengantar': ['Foto KTP Asli', 'Foto KK Asli'],
    'sktm': ['Foto KTP', 'Foto KK', 'Foto Rumah (Depan & Dalam)', 'Surat Pernyataan RT/RW'],
    'domisili': ['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW'],
    'usaha': ['Foto KTP', 'Foto KK', 'Foto Tempat Usaha', 'Surat Pengantar RT/RW']
};

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState('submit');
    const [form, setForm] = useState({
        full_name: '',
        nik: '',
        phone: '',
        request_type: 'surat_pengantar',
        details: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Search State
    const [searchNik, setSearchNik] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await createServiceRequest(form);
            setStatus('success');
            setForm({ full_name: '', nik: '', phone: '', request_type: 'surat_pengantar', details: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchLoading(true);
        try {
            const res = await searchService(searchNik);
            if (res.data.status) {
                setSearchResults(res.data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error(error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Layanan Mandiri</h1>
                    <p className="text-slate-600 mt-2">Ajukan surat dan pantau status permohonan Anda.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'submit' ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            Ajukan Surat
                        </button>
                        <button
                            onClick={() => setActiveTab('check')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'check' ? 'bg-primary text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            Cek Status
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

                    {activeTab === 'submit' ? (
                        <>
                            {status === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                                    <CheckCircle size={20} /> Permohonan berhasil dikirim. Pantau status di menu "Cek Status".
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                                    <AlertCircle size={20} /> Gagal mengirim permohonan. Silakan coba lagi.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                        <input type="text" name="full_name" required value={form.full_name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Sesuai KTP" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                                        <input type="text" name="nik" required value={form.nik} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" placeholder="16 Digit NIK" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                                    <input type="text" name="phone" required value={form.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none" placeholder="Contoh: 08123456789 (Agar bisa dihubungi)" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Layanan</label>
                                    <select name="request_type" value={form.request_type} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none">
                                        <option value="surat_pengantar">Surat Pengantar (KTP/KK)</option>
                                        <option value="sktm">Surat Keterangan Tidak Mampu (SKTM)</option>
                                        <option value="domisili">Surat Keterangan Domisili</option>
                                        <option value="usaha">Surat Izin Usaha Mikro</option>
                                    </select>
                                </div>

                                {/* Dynamic Requirements Info */}
                                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                                    <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <h4 className="font-semibold text-blue-800 text-sm">Persyaratan Dokumen:</h4>
                                        <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                                            {SERVICE_REQUIREMENTS[form.request_type]?.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                            ))}
                                            <li>Siapkan dokumen tersebut saat pengambilan surat.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Detail Keperluan</label>
                                    <textarea name="details" value={form.details} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none h-24" placeholder="Jelaskan detail keperluan permohonan Anda..."></textarea>
                                </div>

                                <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-bold transition ${loading ? 'bg-slate-400' : 'bg-primary hover:bg-primary-dark'}`}>
                                    {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                                </button>
                            </form>
                        </>
                    ) : (
                        // Check Status Tab
                        <div>
                            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                                <input
                                    type="text"
                                    value={searchNik}
                                    onChange={(e) => setSearchNik(e.target.value)}
                                    placeholder="Masukkan NIK Anda..."
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                                <button type="submit" disabled={searchLoading} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-900 transition flex items-center gap-2">
                                    {searchLoading ? 'Mencari...' : <><Search size={18} /> Cari</>}
                                </button>
                            </form>

                            {searchResults && (
                                <div className="space-y-4">
                                    {searchResults.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500">
                                            <FileText size={48} className="mx-auto mb-2 text-slate-300" />
                                            <p>Tidak ditemukan permohonan dengan NIK tersebut.</p>
                                        </div>
                                    ) : (
                                        searchResults.map(res => (
                                            <div key={res.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center hover:bg-slate-50 transition">
                                                <div>
                                                    <p className="font-bold text-slate-800 capitalize">{res.request_type.replace('_', ' ')}</p>
                                                    <p className="text-xs text-slate-500">{res.created_at}</p>
                                                </div>
                                                <div>
                                                    {res.status === 'approved' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Disetujui</span>}
                                                    {res.status === 'rejected' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>}
                                                    {res.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu</span>}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
