<?php

class Database {
    private $db_file = __DIR__ . '/../database/database.sqlite';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            if (!file_exists($this->db_file)) {
                 // Create file if not exists
                 touch($this->db_file);
            }
            
            $this->conn = new PDO("sqlite:" . $this->db_file);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
