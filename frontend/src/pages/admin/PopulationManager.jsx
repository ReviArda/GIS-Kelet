import { useState, useEffect } from 'react';
import { getPopulationStats, updatePopulationStats } from '../../services/api';
import { Users, Edit2, Save, Plus, Trash2, X, Activity, UserCheck, Home } from 'lucide-react';

// Helper Functions (Defined outside component to avoid re-creation)
const updateDynamicList = (setter, list, index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setter(newList);
};

const addDynamicItem = (setter, list) => {
    setter([...list, { label: '', value: 0 }]);
};

const removeDynamicItem = (setter, list, index) => {
    const newList = list.filter((_, i) => i !== index);
    setter(newList);
};

const StatInputRow = ({ items, setter, title, icon: Icon }) => {
    const total = items.reduce((acc, curr) => acc + (parseInt(curr.value) || 0), 0);

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-primary" size={18} />}
                    <h4 className="font-bold text-slate-700">{title}</h4>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        Total: <span className="text-slate-800">{total}</span>
                    </span>
                    <button onClick={() => addDynamicItem(setter, items)} className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all font-medium">
                        <Plus size={14} /> Tambah
                    </button>
                </div>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">
                        <p>Belum ada data detail</p>
                    </div>
                )}
                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center group">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Label (Contoh: Petani)"
                                value={item.label}
                                onChange={(e) => updateDynamicList(setter, items, idx, 'label', e.target.value)}
                                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="w-24 relative">
                            <input
                                type="number"
                                placeholder="0"
                                value={item.value}
                                onChange={(e) => updateDynamicList(setter, items, idx, 'value', e.target.value)}
                                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono text-center"
                            />
                        </div>
                        <button
                            onClick={() => removeDynamicItem(setter, items, idx)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus Baris"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function PopulationManager() {
    const [stats, setStats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    // Form States
    const [formData, setFormData] = useState({});
    const [jobs, setJobs] = useState([]);
    const [education, setEducation] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getPopulationStats();
            if (res.data.data) setStats(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (item) => {
        setActiveItem(item);
        setFormData({
            id: item.id,
            dusun: item.dusun,
            total_male: item.total_male,
            total_female: item.total_female,
            total_families: item.total_families
        });

        // Parse JSON for Jobs
        try {
            const parsedJobs = typeof item.job_stats === 'string' ? JSON.parse(item.job_stats) : item.job_stats;
            setJobs(Object.entries(parsedJobs || {}).map(([k, v]) => ({ label: k, value: v })));
        } catch (e) { setJobs([]); }

        // Parse JSON for Education
        try {
            const parsedEdu = typeof item.education_stats === 'string' ? JSON.parse(item.education_stats) : item.education_stats;
            setEducation(Object.entries(parsedEdu || {}).map(([k, v]) => ({ label: k, value: v })));
        } catch (e) { setEducation([]); }

        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        // Convert Arrays back to Objects
        const job_stats = jobs.reduce((acc, curr) => {
            if (curr.label) acc[curr.label] = parseInt(curr.value) || 0;
            return acc;
        }, {});

        const education_stats = education.reduce((acc, curr) => {
            if (curr.label) acc[curr.label] = parseInt(curr.value) || 0;
            return acc;
        }, {});

        const payload = {
            ...formData,
            job_stats,
            education_stats
        };

        try {
            await updatePopulationStats(payload);
            alert('Data berhasil diperbarui!');
            setIsModalOpen(false);
            fetchStats();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan perubahan.');
        }
    };

    // Calculate Summary
    const summary = stats.reduce((acc, curr) => ({
        male: acc.male + (parseInt(curr.total_male) || 0),
        female: acc.female + (parseInt(curr.total_female) || 0),
        families: acc.families + (parseInt(curr.total_families) || 0)
    }), { male: 0, female: 0, families: 0 });

    const StatCard = ({ label, value, icon: Icon, color, subColor }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-all">
            <div>
                <p className="text-slate-500 font-medium text-sm mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-xl ${subColor} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Manajemen Kependudukan</h2>
                <p className="text-slate-500 mt-1">Kelola data demografi dan statistik desa</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Kepala Keluarga"
                    value={summary.families}
                    icon={Home}
                    color="text-orange-600"
                    subColor="bg-orange-50"
                />
                <StatCard
                    label="Penduduk Laki-laki"
                    value={summary.male}
                    icon={UserCheck}
                    color="text-blue-600"
                    subColor="bg-blue-50"
                />
                <StatCard
                    label="Penduduk Perempuan"
                    value={summary.female}
                    icon={Users}
                    color="text-pink-600"
                    subColor="bg-pink-50"
                />
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary" />
                        <span className="text-slate-800 font-bold text-lg">Data Statistik per Dusun</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-5 font-bold border-b border-slate-100">Dusun</th>
                                <th className="p-5 font-bold border-b border-slate-100">Populasi (L/P)</th>
                                <th className="p-5 font-bold border-b border-slate-100">Total KK</th>
                                <th className="p-5 font-bold border-b border-slate-100 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 italic">Belum ada data dusun.</td>
                                </tr>
                            )}
                            {stats.map(item => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-5 font-bold text-slate-700">{item.dusun}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 font-bold uppercase">Laki-laki</span>
                                                <span className="text-blue-600 font-bold">{item.total_male}</span>
                                            </div>
                                            <div className="h-8 w-px bg-slate-200"></div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 font-bold uppercase">Perempuan</span>
                                                <span className="text-pink-600 font-bold">{item.total_female}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                                                <Home size={16} />
                                            </div>
                                            <span className="font-semibold text-slate-700">{item.total_families} KK</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => openEditModal(item)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-primary hover:text-primary hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium mx-auto">
                                            <Edit2 size={14} /> Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">Edit Data Statistik</h3>
                                <p className="text-sm text-slate-500">Update data untuk dusun <span className="font-semibold text-primary">{formData.dusun}</span></p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 flex-1">
                            {/* Basic Section */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Informasi Dasar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Total Laki-laki</label>
                                        <input type="number" name="total_male" value={formData.total_male} onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Total Perempuan</label>
                                        <input type="number" name="total_female" value={formData.total_female} onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Total Kepala Keluarga</label>
                                        <input type="number" name="total_families" value={formData.total_families} onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[400px]">
                                <StatInputRow title="Statistik Pekerjaan" items={jobs} setter={setJobs} icon={Users} />
                                <StatInputRow title="Statistik Pendidikan" items={education} setter={setEducation} icon={Users} />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-all">
                                Batal
                            </button>
                            <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                <Save size={18} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
