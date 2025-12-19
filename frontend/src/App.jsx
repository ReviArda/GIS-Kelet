import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useState, Component } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import StatisticsPage from './pages/StatisticsPage';
import ServicesPage from './pages/ServicesPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import LocationManager from './pages/admin/LocationManager';
import PopulationManager from './pages/admin/PopulationManager';
import ServiceManager from './pages/admin/ServiceManager';
import { Home, LogOut, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full border border-red-200">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan Aplikasi</h1>
            <p className="text-slate-600 mb-4">Mohon maaf, aplikasi mengalami error saat memuat.</p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto text-xs font-mono">
              {this.state.error && this.state.error.toString()}
            </div>
            <button onClick={() => window.location.reload()} className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition">
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

import ProtectedRoute from './components/ProtectedRoute';

// ... (other imports remain)

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    navigate('/admin/login');
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <div className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
            <Layers size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-none">Desa Kelet</span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/gis" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>GIS Data</span>
          </Link>
          <Link to="/admin/population" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>Kependudukan</span>
          </Link>
          <Link to="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>Layanan</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900 transition">
            <Home size={18} /> <span>Ke Website Utama</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard Area</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition">
            <LogOut size={16} /> Logout
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/services" element={<ServicesPage />} />
          </Route>

          {/* Admin Login (Standalone) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="gis" element={<LocationManager />} />
              <Route path="population" element={<PopulationManager />} />
              <Route path="services" element={<ServiceManager />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
