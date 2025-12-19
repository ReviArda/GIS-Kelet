import { useEffect, useState } from 'react';
import { getServices, getLocations } from '../../services/api';
import { BarChart, Map, Users, FileText, Plus, ArrowRight, Activity, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        locations: 0,
        requests: 0,
        population: 1540
    });
    const [user, setUser] = useState({ username: 'Admin' });

    useEffect(() => {
        // Get user from local storage
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchData = async () => {
            try {
                const [locRes, servRes] = await Promise.all([
                    getLocations(),
                    getServices()
                ]);

                setStats({
                    locations: locRes.data.data ? locRes.data.data.length : 0,
                    requests: servRes.data.data ? servRes.data.data.length : 0,
                    population: 1540 // Mock data
                });
            } catch (err) {
                console.error("Dashboard fetch error", err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            {/* Simple Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500">Ringkasan aktivitas terkini di Desa Kelet.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    to="/admin/gis"
                    icon={<Map size={24} className="text-blue-600" />}
                    label="Lokasi GIS"
                    value={stats.locations}
                    color="bg-blue-50 border-blue-200"
                    textColor="text-blue-700"
                />
                <StatCard
                    to="/admin/population"
                    icon={<Users size={24} className="text-emerald-600" />}
                    label="Total Penduduk"
                    value={stats.population}
                    color="bg-emerald-50 border-emerald-200"
                    textColor="text-emerald-700"
                />
                <StatCard
                    to="/admin/services"
                    icon={<FileText size={24} className="text-orange-600" />}
                    label="Permohonan Layanan"
                    value={stats.requests}
                    color="bg-orange-50 border-orange-200"
                    textColor="text-orange-700"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-primary" /> Aktivitas Terbaru
                        </h3>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Realtime</span>
                    </div>
                    <div className="space-y-4">
                        <ActivityItem
                            icon={<FileText size={16} className="text-blue-500" />}
                            bg="bg-blue-100"
                            text="Permohonan Surat Pengantar masuk dari Budi Santoso"
                            time="2 menit lalu"
                        />
                        <ActivityItem
                            icon={<MapPin size={16} className="text-emerald-500" />}
                            bg="bg-emerald-100"
                            text="Data Lokasi 'Warung Bu Siti' ditambahkan"
                            time="1 jam lalu"
                        />
                        <ActivityItem
                            icon={<Users size={16} className="text-purple-500" />}
                            bg="bg-purple-100"
                            text="Update Statistik Penduduk RW 02"
                            time="3 jam lalu"
                        />
                        <ActivityItem
                            icon={<CheckCircle size={16} className="text-green-500" />}
                            bg="bg-green-100"
                            text="Admin menyetujui permohonan SKTM Siti Aminah"
                            time="5 jam lalu"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
                    <h3 className="font-bold text-slate-800 mb-6">Aksi Cepat</h3>
                    <div className="space-y-3">
                        <Link to="/admin/gis" className="group flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:shadow-md transition cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                    <MapPin size={20} />
                                </div>
                                <span className="font-medium text-slate-700">Tambah Lokasi</span>
                            </div>
                            <div className="bg-slate-50 p-1 rounded group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-500 transition">
                                <Plus size={16} />
                            </div>
                        </Link>

                        <Link to="/admin/population" className="group flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:shadow-md transition cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                                    <BarChart size={20} />
                                </div>
                                <span className="font-medium text-slate-700">Update Statistik</span>
                            </div>
                            <div className="bg-slate-50 p-1 rounded group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-500 transition">
                                <Plus size={16} />
                            </div>
                        </Link>

                        <Link to="/admin/services" className="group flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-orange-500 hover:shadow-md transition cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                                    <FileText size={20} />
                                </div>
                                <span className="font-medium text-slate-700">Cek Permohonan</span>
                            </div>
                            <div className="bg-slate-50 p-1 rounded group-hover:bg-orange-50 text-slate-400 group-hover:text-orange-500 transition">
                                <ArrowRight size={16} />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ to, icon, label, value, color, textColor }) {
    return (
        <Link to={to} className={`block p-6 rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg ${color}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                    {icon}
                </div>
                {/* Mock Sparkline/Trend */}
                <div className={`px-2 py-1 rounded-full text-xs font-bold bg-white/50 ${textColor}`}>
                    +2.5%
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</h3>
            </div>
        </Link>
    )
}

function ActivityItem({ icon, bg, text, time }) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
            <div className={`p-2 rounded-lg shrink-0 ${bg}`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-slate-800 text-sm font-medium leading-relaxed">{text}</p>
                <p className="text-xs text-slate-400 mt-1">{time}</p>
            </div>
        </div>
    )
}
