<?php
class Location {
    private $conn;
    private $table_name = "locations";

    public $id;
    public $name;
    public $category;
    public $lat;
    public $lng;
    public $geojson;
    public $description;
    public $image;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (name, category, lat, lng, geojson, description, image) 
                VALUES (:name, :category, :lat, :lng, :geojson, :description, :image)";
        
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));
        // lat, lng are trusted or validated in controller
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":lat", $this->lat);
        $stmt->bindParam(":lng", $this->lng);
        $stmt->bindParam(":geojson", $this->geojson);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image", $this->image);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET name = :name, 
                    category = :category, 
                    lat = :lat, 
                    lng = :lng, 
                    geojson = :geojson, 
                    description = :description, 
                    image = :image
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":lat", $this->lat);
        $stmt->bindParam(":lng", $this->lng);
        $stmt->bindParam(":geojson", $this->geojson);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
