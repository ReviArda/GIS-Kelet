<?php
include_once '../models/Location.php';

class LocationController {
    private $db;
    private $location;

    public function __construct($db) {
        $this->db = $db;
        $this->location = new Location($db);
    }

    public function getAll() {
        $stmt = $this->location->read();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($items, $row);
        }
        return ["status" => true, "data" => $items];
    }

    public function create($data) {
        $this->location->name = $data->name;
        $this->location->category = $data->category;
        $this->location->lat = $data->lat;
        $this->location->lng = $data->lng;
        $this->location->geojson = isset($data->geojson) ? $data->geojson : null;
        $this->location->description = isset($data->description) ? $data->description : "";
        $this->location->image = isset($data->image) ? $data->image : "";

        if ($this->location->create()) {
            return ["status" => true, "message" => "Location created successfully"];
        }
        return ["status" => false, "message" => "Unable to create location"];
    }

    public function update($id, $data) {
        $this->location->id = $id;
        $this->location->name = $data->name;
        $this->location->category = $data->category;
        $this->location->lat = $data->lat;
        $this->location->lng = $data->lng;
        $this->location->geojson = isset($data->geojson) ? $data->geojson : null;
        $this->location->description = isset($data->description) ? $data->description : "";
        $this->location->image = isset($data->image) ? $data->image : "";

        if ($this->location->update()) {
            return ["status" => true, "message" => "Location updated successfully"];
        }
        return ["status" => false, "message" => "Unable to update location"];
    }

    public function delete($id) {
        $this->location->id = $id;
        if($this->location->delete()){
             return ["status" => true, "message" => "Location deleted successfully"];
        }
        return ["status" => false, "message" => "Unable to delete location"];
    }
}
