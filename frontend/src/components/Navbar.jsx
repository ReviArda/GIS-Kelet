import { Link, useLocation } from 'react-router-dom';
import { Map, BarChart, FileText, Home, Layers, Lock } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path
        ? "text-emerald-600 font-semibold bg-emerald-50"
        : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50";

    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-xl shadow-sm z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                            <Layers size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 leading-none">Desa Kelet</span>
                            <span className="text-xs text-emerald-600 font-medium tracking-wide">Pemerintahan Digital</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex space-x-2 items-center">
                        <Link to="/" className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isActive('/')}`}>
                            <Home size={18} /> <span className="text-sm">Beranda</span>
                        </Link>
                        <Link to="/map" className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isActive('/map')}`}>
                            <Map size={18} /> <span className="text-sm">Peta</span>
                        </Link>
                        <Link to="/statistics" className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isActive('/statistics')}`}>
                            <BarChart size={18} /> <span className="text-sm">Statistik</span>
                        </Link>
                        <Link to="/services" className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${isActive('/services')}`}>
                            <FileText size={18} /> <span className="text-sm">Layanan</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Lock size={16} /> <span>Admin Portal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
