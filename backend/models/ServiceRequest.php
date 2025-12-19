<?php
class ServiceRequest {
    private $conn;
    private $table_name = "service_requests";

    public $id;
    public $full_name;
    public $nik;
    public $request_type;
    public $details;
    public $status;

    public $phone;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (full_name, nik, phone, request_type, details, status) 
                VALUES (:full_name, :nik, :phone, :request_type, :details, 'pending')";
        
        $stmt = $this->conn->prepare($query);

        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->nik = htmlspecialchars(strip_tags($this->nik));
        $this->phone = isset($this->phone) ? htmlspecialchars(strip_tags($this->phone)) : '';
        $this->request_type = htmlspecialchars(strip_tags($this->request_type));
        $this->details = htmlspecialchars(strip_tags($this->details));

        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":nik", $this->nik);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":request_type", $this->request_type);
        $stmt->bindParam(":details", $this->details);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read() {
         $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
         $stmt = $this->conn->prepare($query);
         $stmt->execute();
         return $stmt;
    }

    public function search($nik) {
        $query = "SELECT id, full_name, request_type, status, created_at FROM " . $this->table_name . " WHERE nik = :nik ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $nik = htmlspecialchars(strip_tags($nik));
        $stmt->bindParam(":nik", $nik);
        $stmt->execute();
        return $stmt;
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $status = htmlspecialchars(strip_tags($status));
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
