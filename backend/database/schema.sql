-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
);

-- Locations (GIS Data)
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- dusun, faskes, sekolah, kantor, ibadah, umkm
    lat REAL,
    lng REAL,
    geojson TEXT, -- For detailed boundaries
    description TEXT,
    image TEXT
);

-- Population Statistics
CREATE TABLE IF NOT EXISTS population_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_male INTEGER DEFAULT 0,
    total_female INTEGER DEFAULT 0,
    total_families INTEGER DEFAULT 0,
    job_stats TEXT DEFAULT '{}',
    education_stats TEXT DEFAULT '{}',
    age_0_5 INTEGER DEFAULT 0,
    age_6_12 INTEGER DEFAULT 0,
    age_13_17 INTEGER DEFAULT 0,
    age_18_50 INTEGER DEFAULT 0,
    age_50_plus INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    nik TEXT NOT NULL,
    phone TEXT, -- WhatsApp number
    request_type TEXT NOT NULL, -- surat_pengantar, sktm, etc.
    details TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Admin User (password: admin123)
-- Hash generated via PHP: password_hash('admin123', PASSWORD_BCRYPT)
INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', '$2y$10$YourHashedPasswordHere...', 'admin');

-- Seed Data: Sample Locations in Kelet/Pekalongan area (approximate coords)
INSERT INTO locations (name, category, lat, lng, description) VALUES 
('Kantor Balai Desa Kelet', 'kantor', -6.500000, 110.700000, 'Pusat Pemerintahan Desa'),
('SDN 1 Kelet', 'sekolah', -6.501000, 110.701000, 'Sekolah Dasar Negeri 1');

-- Seed Data: Population
INSERT INTO population_stats (dusun, rt, rw, total_male, total_female, total_families) VALUES 
('Krajan', '01', '01', 150, 140, 80),
('Winong', '02', '01', 120, 130, 70);
