<?php
include_once '../models/ServiceRequest.php';

class ServiceController {
    private $db;
    private $service;

    public function __construct($db) {
        $this->db = $db;
        $this->service = new ServiceRequest($db);
    }

    public function getAll() {
        $stmt = $this->service->read();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($items, $row);
        }
        return ["status" => true, "data" => $items];
    }

    public function create($data) {
        $this->service->full_name = $data->full_name;
        $this->service->nik = $data->nik;
        $this->service->phone = isset($data->phone) ? $data->phone : '';
        $this->service->request_type = $data->request_type;
        $this->service->details = isset($data->details) ? $data->details : "";

        if ($this->service->create()) {
            return ["status" => true, "message" => "Request submitted successfully"];
        }
        return ["status" => false, "message" => "Unable to submit request"];
    }

    public function search($nik) {
        $stmt = $this->service->search($nik);
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($items, $row);
        }
        // Always return success even if empty, for safety
        return ["status" => true, "data" => $items];
    }

    public function updateStatus($data) {
        if ($this->service->updateStatus($data->id, $data->status)) {
             return ["status" => true, "message" => "Request status updated"];
        }
        return ["status" => false, "message" => "Unable to update status"];
    }
}
