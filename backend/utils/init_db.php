<?php
try {
    $dbPath = __DIR__ . '/../database/database.sqlite';
    if (!file_exists($dbPath)) {
        touch($dbPath);
    }
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $schemaPath = __DIR__ . '/../database/schema.sql';
    if (!file_exists($schemaPath)) {
        die("Schema file not found at: $schemaPath");
    }
    $sql = file_get_contents($schemaPath);
    
    // Split key commands if needed, or just exec raw
    $db->exec($sql);
    
    echo "Database initialized successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
