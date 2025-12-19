<?php
class Population {
    private $conn;
    private $table_name = "population_stats";

    public $id;
    public $dusun;
    public $rt;
    public $rw;
    public $total_male;
    public $total_female;
    public $total_families;
    public $job_stats;
    public $education_stats;
    // ... other fields if dynamic update needed

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    public function update() {
        // Only 1 row usually, or update by ID
         $query = "UPDATE " . $this->table_name . " 
                SET total_male = :total_male, 
                    total_female = :total_female, 
                    total_families = :total_families,
                    job_stats = :job_stats,
                    education_stats = :education_stats
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->total_male = htmlspecialchars(strip_tags($this->total_male));
        $this->total_female = htmlspecialchars(strip_tags($this->total_female));
        $this->total_families = htmlspecialchars(strip_tags($this->total_families));
        // JSON strings don't need extensive stripping usually, but basic safety:
        // $this->job_stats = ...

        $stmt->bindParam(":total_male", $this->total_male);
        $stmt->bindParam(":total_female", $this->total_female);
        $stmt->bindParam(":total_families", $this->total_families);
        $stmt->bindParam(":job_stats", $this->job_stats);
        $stmt->bindParam(":education_stats", $this->education_stats);
        $stmt->bindParam(":id", $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
