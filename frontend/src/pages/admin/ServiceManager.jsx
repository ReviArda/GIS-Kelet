import { useState, useEffect, useRef } from 'react';
import { getServices, updateServiceStatus } from '../../services/api';
import { FileText, Check, X, Clock, Printer, MessageCircle } from 'lucide-react';

export default function ServiceManager() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await getServices();
            if (res.data.data) setRequests(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateServiceStatus(id, newStatus);
            fetchRequests();
        } catch (err) {
            alert('Gagal update status');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full"><Check size={12} /> Disetujui</span>;
            case 'rejected': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full"><X size={12} /> Ditolak</span>;
            default: return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full"><Clock size={12} /> Menunggu</span>;
        }
    };

    const handlePrint = (req) => {
        const printContent = `
            <html>
                <head>
                    <title>Cetak Permohonan</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; }
                        h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        .content { margin-top: 20px; }
                        .row { margin-bottom: 15px; display: flex; }
                        .label { width: 150px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>PERMOHONAN LAYANAN DESA</h1>
                    <div class="content">
                        <div class="row"><div class="label">Nama Lengkap</div>: ${req.full_name}</div>
                        <div class="row"><div class="label">NIK</div>: ${req.nik}</div>
                        <div class="row"><div class="label">No. WA</div>: ${req.phone || '-'}</div>
                        <div class="row"><div class="label">Jenis Layanan</div>: ${req.request_type.replace('_', ' ').toUpperCase()}</div>
                        <div class="row"><div class="label">Keperluan</div>: ${req.details}</div>
                        <div class="row"><div class="label">Tanggal</div>: ${req.created_at}</div>
                        <div class="row"><div class="label">Status</div>: ${req.status.toUpperCase()}</div>
                    </div>
                </body>
            </html>
        `;
        const printWindow = window.open('', '', 'width=600,height=800');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    const handleWhatsApp = (phone) => {
        if (!phone) return alert('Nomor WA tidak tersedia');
        // Format phone: if 08... replace 0 with 62
        let formatted = phone.replace(/\D/g, '');
        if (formatted.startsWith('0')) formatted = '62' + formatted.substring(1);
        window.open(`https://wa.me/${formatted}`, '_blank');
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Layanan Masyarakat</h2>

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 && <p className="text-slate-500">Belum ada permohonan masuk.</p>}

                {requests.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900">{req.full_name}</h3>
                                    {getStatusBadge(req.status)}
                                </div>
                                <p className="text-sm text-slate-500 font-mono">NIK: {req.nik} {req.phone && `| WA: ${req.phone}`}</p>
                                <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-2 rounded">
                                    <span className="font-semibold capitalize">{req.request_type.replace('_', ' ')}</span>: {req.details}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">{req.created_at}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                                <button onClick={() => handlePrint(req)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Print">
                                    <Printer size={18} />
                                </button>
                                {req.phone && (
                                    <button onClick={() => handleWhatsApp(req.phone)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Hubungi WA">
                                        <MessageCircle size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {req.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusChange(req.id, 'approved')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition shadow-md">
                                            Setujui
                                        </button>
                                        <button onClick={() => handleStatusChange(req.id, 'rejected')} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-bold rounded-lg transition">
                                            Tolak
                                        </button>
                                    </>
                                )}
                                {req.status !== 'pending' && (
                                    <button onClick={() => handleStatusChange(req.id, 'pending')} className="text-sm text-slate-400 hover:text-slate-600 underline">
                                        Reset Status
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
