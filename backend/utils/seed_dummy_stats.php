<?php
// backend/utils/seed_dummy_stats.php

$dbPath = __DIR__ . '/../database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

echo "Connected to DB.\n";

// Check existing data
$stmt = $db->query("SELECT * FROM population_stats");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Dummy JSON Data
$dummyJobs = json_encode([
    "Petani" => 120,
    "PNS" => 15,
    "Buruh Tani" => 80,
    "Wiraswasta" => 45,
    "Guru" => 12,
    "Pedagang" => 35,
    "Nelayan" => 5
]);

$dummyEdu = json_encode([
    "Tidak Sekolah" => 20,
    "SD" => 80,
    "SMP" => 110,
    "SMA/SMK" => 150,
    "Diploma" => 25,
    "Sarjana (S1)" => 40,
    "Pascasarjana (S2)" => 5
]);

if (count($rows) > 0) {
    echo "Found " . count($rows) . " rows. Updating with dummy stats...\n";
    $updateStmt = $db->prepare("UPDATE population_stats SET job_stats = :jobs, education_stats = :edu, total_male = 200, total_female = 210, total_families = 120 WHERE id = :id");
    
    foreach ($rows as $row) {
        $updateStmt->execute([
            ':jobs' => $dummyJobs,
            ':edu' => $dummyEdu,
            ':id' => $row['id']
        ]);
        echo "Updated row ID " . $row['id'] . "\n";
    }
} else {
    echo "Table empty. Inserting new dummy rows...\n";
    $insertStmt = $db->prepare("INSERT INTO population_stats (dusun, rt, rw, total_male, total_female, total_families, job_stats, education_stats) VALUES (:dusun, :rt, :rw, 150, 145, 85, :jobs, :edu)");
    
    $dusuns = [
        ['Krajan', '01', '01'],
        ['Winong', '02', '01'],
        ['Ngemplak', '03', '02'],
        ['Kelet Ilir', '04', '02']
    ];

    foreach ($dusuns as $d) {
        try {
            $insertStmt->execute([
                ':dusun' => $d[0],
                ':rt' => $d[1],
                ':rw' => $d[2],
                ':jobs' => $dummyJobs,
                ':edu' => $dummyEdu
            ]);
            echo "Inserted " . $d[0] . "\n";
        } catch (Exception $e) {
            echo "Failed to insert " . $d[0] . ": " . $e->getMessage() . "\n";
            // Fallback if column 'dusun' is missing (schema issue)
            try {
                 $altStmt = $db->prepare("INSERT INTO population_stats (total_male, total_female, total_families, job_stats, education_stats) VALUES (150, 145, 85, :jobs, :edu)");
                 $altStmt->execute([':jobs' => $dummyJobs, ':edu' => $dummyEdu]);
                 echo "Inserted generic row (no dusun name)\n";
            } catch (Exception $e2) {
                 echo "Critical error: " . $e2->getMessage() . "\n";
            }
        }
    }
}

echo "Seeding completed successfully.\n";
