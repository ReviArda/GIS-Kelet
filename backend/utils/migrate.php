<?php
include_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "Database Connected successfully.\n";

    // 1. Locations Table
    $sql_locations = "CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        lat REAL,
        lng REAL,
        geojson TEXT,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql_locations);
    echo "Table 'locations' checked/created.\n";

    // 2. Population Stats Table
    $sql_pop = "CREATE TABLE IF NOT EXISTS population_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dusun TEXT NOT NULL,
        rt INTEGER,
        rw INTEGER,
        total_male INTEGER,
        total_female INTEGER,
        total_families INTEGER,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql_pop);
    echo "Table 'population_stats' checked/created.\n";
    
    // Seed Population if empty
    $check = $db->query("SELECT COUNT(*) FROM population_stats")->fetchColumn();
    if ($check == 0) {
        $db->exec("INSERT INTO population_stats (dusun, rt, rw, total_male, total_female, total_families) VALUES 
            ('Krajan', 1, 1, 120, 130, 80),
            ('Krajan', 2, 1, 110, 115, 75),
            ('Pekalongan', 1, 1, 140, 145, 90)
        ");
        echo "Seeded 'population_stats'.\n";
    }

    // Update population_stats table if missing columns
    try {
        $db->exec("ALTER TABLE population_stats ADD COLUMN job_stats TEXT DEFAULT '{}'");
        $db->exec("ALTER TABLE population_stats ADD COLUMN education_stats TEXT DEFAULT '{}'");
    } catch (Exception $e) {
        // Columns might already exist, ignore
    }

    // 3. Service Requests Table
    $sql_services = "CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nik TEXT NOT NULL,
        full_name TEXT NOT NULL,
        request_type TEXT NOT NULL,
        details TEXT,
        status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql_services);
    echo "Table 'service_requests' checked/created.\n";

    echo "Migration completed successfully!\n";

    // Test Insert Location
    // $db->exec("INSERT INTO locations (name, category, lat, lng, description) VALUES ('Test Marker', 'dusun', -6.5, 110.5, 'Test data')");
    // echo "Inserted Test Location.\n";

} else {
    echo "Failed to connect to database.\n";
}
?>
