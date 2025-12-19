export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Desa Kelet</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Mewujudkan Desa Kelet yang transparan, maju, dan berbasis digital melalui Sistem Informasi Geografis Terpadu.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Kontak Kami</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                        <li>Jl. Raya Kelet No. 1, Jepara</li>
                        <li>(0291) 1234567</li>
                        <li>admin@desakelet.id</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Jam Pelayanan</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                        <li>Senin - Kamis: 08:00 - 15:00</li>
                        <li>Jumat: 08:00 - 11:00</li>
                        <li>Sabtu - Minggu: Libur</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} Pemerintah Desa Kelet. All rights reserved.
            </div>
        </footer>
    );
}
