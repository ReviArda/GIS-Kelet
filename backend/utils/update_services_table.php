<?php
// backend/utils/update_services_table.php

$dbPath = __DIR__ . '/../database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to DB.\n";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

try {
    // Add phone column
    $sql = "ALTER TABLE service_requests ADD COLUMN phone TEXT";
    $db->exec($sql);
    echo "Added 'phone' column to service_requests.\n";
} catch (PDOException $e) {
    echo "Column 'phone' might already exist or error: " . $e->getMessage() . "\n";
}
