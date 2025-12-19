import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getPopulationStats } from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function StatisticsPage() {
    const [stats, setStats] = useState({
        gender: null,
        jobs: null,
        education: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPopulationStats();
                if (res.data.data) {
                    processData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchData();
    }, []);

    const processData = (rawData) => {
        let totalMale = 0;
        let totalFemale = 0;
        let jobCounts = {};
        let eduCounts = {};

        rawData.forEach(item => {
            totalMale += parseInt(item.total_male) || 0;
            totalFemale += parseInt(item.total_female) || 0;

            // Aggregate Jobs - Handle JSON
            let jobs = typeof item.job_stats === 'string' ? JSON.parse(item.job_stats || '{}') : item.job_stats;
            Object.entries(jobs || {}).forEach(([key, val]) => {
                jobCounts[key] = (jobCounts[key] || 0) + parseInt(val);
            });

            // Aggregate Education
            let edu = typeof item.education_stats === 'string' ? JSON.parse(item.education_stats || '{}') : item.education_stats;
            Object.entries(edu || {}).forEach(([key, val]) => {
                eduCounts[key] = (eduCounts[key] || 0) + parseInt(val);
            });
        });

        setStats({
            gender: {
                labels: ['Laki-laki', 'Perempuan'],
                datasets: [{
                    label: 'Jumlah Penduduk',
                    data: [totalMale, totalFemale],
                    backgroundColor: ['#0ea5e9', '#ec4899'],
                    borderWidth: 0
                }]
            },
            jobs: {
                labels: Object.keys(jobCounts),
                datasets: [{
                    label: 'Jumlah',
                    data: Object.values(jobCounts),
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }]
            },
            education: {
                labels: Object.keys(eduCounts),
                datasets: [{
                    label: 'Jumlah',
                    data: Object.values(eduCounts),
                    backgroundColor: '#8b5cf6',
                    borderRadius: 8
                }]
            }
        });
    };

    if (!stats.gender) return <div className="min-h-screen pt-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900">Data Statistik Desa</h1>
                    <p className="text-slate-600 mt-2">Transparansi data kependudukan dan potensi Desa Kelet</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gender Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-800">Komposisi Gender</h3>
                        <div className="h-64 flex justify-center relative">
                            <Pie data={stats.gender} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Education Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-800">Tingkat Pendidikan</h3>
                        <div className="h-64">
                            <Bar
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true } }
                                }}
                                data={stats.education}
                            />
                        </div>
                    </div>

                    {/* Jobs Chart (Full Width) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition md:col-span-2">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-800">Profesi Penduduk</h3>
                        <div className="h-80">
                            <Bar
                                options={{
                                    maintainAspectRatio: false,
                                    indexAxis: 'y', // Horizontal Bar
                                    plugins: { legend: { display: false } }
                                }}
                                data={stats.jobs}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
