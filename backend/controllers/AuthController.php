<?php
include_once '../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function login($data) {
        $this->user->username = $data->username;
        $stmt = $this->user->login();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && password_verify($data->password, $row['password'])) {
            return [
                "status" => true,
                "message" => "Login successful",
                "data" => [
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role']
                ]
            ];
        }

        return ["status" => false, "message" => "Invalid credentials"];
    }

    public function register($data) {
        // Basic registration for admin/demo purposes
        $this->user->username = $data->username;
        $this->user->password = password_hash($data->password, PASSWORD_BCRYPT);
        $this->user->role = isset($data->role) ? $data->role : 'user';

        if ($this->user->create()) {
            return ["status" => true, "message" => "User registered successfully"];
        }
        return ["status" => false, "message" => "Unable to register user"];
    }
}
