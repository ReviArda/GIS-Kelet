import { Link } from 'react-router-dom';
import { Map, Users, FileText, ArrowRight, Activity } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-white font-sans">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-32 lg:py-40 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549421263-60648331871b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm border border-emerald-500/20">
                        <Activity size={16} /> Sistem Informasi Geografis Terpadu
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                        Desa Kelet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Digital</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                        Menghadirkan transparansi data, pemetaan wilayah presisi, dan layanan publik digital untuk memajukan potensi desa secara berkelanjutan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to="/map" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 transition text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
                            <Map size={20} /> Jelajahi Peta
                        </Link>
                        <Link to="/services" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md transition text-white border border-white/20 font-bold rounded-full flex items-center justify-center gap-2">
                            Layanan Warga
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Inovasi Digital Desa</h2>
                        <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Platform terintegrasi yang memudahkan akses informasi dan administrasi bagi seluruh warga Desa Kelet.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Map className="w-8 h-8 text-emerald-500" />}
                            title="Pemetaan Wilayah"
                            desc="Visualisasi batas dusun, fasilitas umum, dan potensi ekonomi dalam peta interaktif berbasis data geospasial yang akurat."
                            link="/map"
                            color="emerald"
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-blue-500" />}
                            title="Statistik Kependudukan"
                            desc="Data demografi real-time yang menyajikan komposisi penduduk, profesi, dan tingkat pendidikan secara transparan."
                            link="/statistics"
                            color="blue"
                        />
                        <FeatureCard
                            icon={<FileText className="w-8 h-8 text-orange-500" />}
                            title="Layanan Mandiri"
                            desc="Pengurusan surat pengantar dan administrasi kependudukan kini dapat dilakukan dari rumah secara efisien."
                            link="/services"
                            color="orange"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc, link, color }) {
    const bgColors = {
        emerald: 'bg-emerald-50 hover:bg-emerald-100',
        blue: 'bg-blue-50 hover:bg-blue-100',
        orange: 'bg-orange-50 hover:bg-orange-100',
    };

    return (
        <div className={`p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100 shadow-sm hover:shadow-xl`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${bgColors[color]}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">{desc}</p>
            <Link to={link} className={`text-${color}-600 font-bold flex items-center gap-1 hover:gap-2 transition-all`}>
                Akses Fitur <ArrowRight size={16} />
            </Link>
        </div>
    );
}
