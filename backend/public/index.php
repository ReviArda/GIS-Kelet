<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';

// Basic Router
// Basic Router
// DEBUG
// echo json_encode(["uri" => $_SERVER['REQUEST_URI']]); exit;
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($path, '/'));

// Handle /api prefix if present
if (isset($parts[0]) && $parts[0] === 'api') {
    array_shift($parts);
}

$resource = $parts[0] ?? null;
$id = $parts[1] ?? null;

$dbClass = new Database();
$db = $dbClass->getConnection();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"));

// Dispatch
switch($resource) {
    case 'auth':
        include_once '../controllers/AuthController.php';
        $controller = new AuthController($db);
        if ($requestMethod == 'POST') {
             if (isset($parts[1]) && $parts[1] == 'login') {
                 echo json_encode($controller->login($data));
             } elseif (isset($parts[1]) && $parts[1] == 'register') {
                 echo json_encode($controller->register($data));
             }
        }
        break;
        
    case 'locations':
        include_once '../controllers/LocationController.php';
        $locationController = new LocationController($db);
        if ($requestMethod == 'GET') {
            echo json_encode($locationController->getAll());
        } elseif ($requestMethod == 'POST') {
            echo json_encode($locationController->create($data));
        } elseif ($requestMethod == 'PUT') {
             if($id) echo json_encode($locationController->update($id, $data));
        } elseif ($requestMethod == 'DELETE') {
             if($id) echo json_encode($locationController->delete($id));
        }
        break;

    case 'population':
        include_once '../controllers/PopulationController.php';
        $popController = new PopulationController($db);
         if ($requestMethod == 'GET') {
            echo json_encode($popController->getAll());
        } elseif ($requestMethod == 'PUT') {
            echo json_encode($popController->update($data));
        }
        break;

    case 'services':
        include_once '../controllers/ServiceController.php';
        $serviceController = new ServiceController($db);
        if ($requestMethod == 'GET') {
             if (isset($parts[1]) && $parts[1] == 'search' && isset($parts[2])) {
                 echo json_encode($serviceController->search($parts[2]));
             } else {
                 echo json_encode($serviceController->getAll());
             }
        } elseif ($requestMethod == 'POST') {
             // check if it is status update or new
             if(isset($parts[1]) && $parts[1] == 'status'){
                 echo json_encode($serviceController->updateStatus($data));
             } else {
                 echo json_encode($serviceController->create($data));
             }
        }
        break;
        
    default:
        echo json_encode(["message" => "Welcome to Desa Kelet GIS API. Endpoint not found."]);
        break;
}
