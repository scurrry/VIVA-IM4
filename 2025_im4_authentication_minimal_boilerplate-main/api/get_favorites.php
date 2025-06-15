<?php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Nicht eingeloggt']);
    exit;
}

$userId = $_SESSION['user_id'];

$sql = "SELECT locations.* FROM favorites
        JOIN locations ON favorites.locations_id = locations.id
        WHERE favorites.users_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$userId]);
$favorites = $stmt->fetchAll();

echo json_encode($favorites);
