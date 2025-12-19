<?php
include_once '../models/Population.php';

class PopulationController {
    private $db;
    private $population;

    public function __construct($db) {
        $this->db = $db;
        $this->population = new Population($db);
    }

    public function getAll() {
        $stmt = $this->population->read();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($items, $row);
        }
        return ["status" => true, "data" => $items];
    }
    
    // Simplistic update for demo
    public function update($data) {
        $this->population->id = $data->id;
        $this->population->total_male = $data->total_male;
        $this->population->total_female = $data->total_female;
        $this->population->total_families = $data->total_families;
        
        // Handle JSON fields, ensure they are strings
        $this->population->job_stats = isset($data->job_stats) ? json_encode($data->job_stats) : '{}';
        $this->population->education_stats = isset($data->education_stats) ? json_encode($data->education_stats) : '{}';

        
         if ($this->population->update()) {
            return ["status" => true, "message" => "Population stats updated"];
        }
        return ["status" => false, "message" => "Unable to update stats"];
    }
}
