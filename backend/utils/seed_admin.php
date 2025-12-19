<?php
// backend/utils/seed_admin.php

$dbPath = __DIR__ . '/../database/database.sqlite';
try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to DB.\n";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$username = 'admin';
$password = 'admin123';
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$role = 'admin';

// Check if user exists
$stmt = $db->prepare("SELECT id FROM users WHERE username = :username");
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if ($user) {
    // Update existing admin
    $update = $db->prepare("UPDATE users SET password = :password WHERE username = :username");
    if ($update->execute([':password' => $hashed_password, ':username' => $username])) {
        echo "Admin password updated to 'admin123'.\n";
    } else {
        echo "Failed to update admin password.\n";
    }
} else {
    // Create new admin
    $insert = $db->prepare("INSERT INTO users (username, password, role) VALUES (:username, :password, :role)");
    if ($insert->execute([':username' => $username, ':password' => $hashed_password, ':role' => $role])) {
        echo "Admin user created with password 'admin123'.\n";
    } else {
        // If insert failed (maybe unique constraint even if select returned empty?), handle it
        echo "Failed to create admin user.\n";
    }
}
