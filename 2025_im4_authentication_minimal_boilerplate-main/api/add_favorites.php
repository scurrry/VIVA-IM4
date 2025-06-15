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
$data = json_decode(file_get_contents('php://input'), true);
$locationId = $data['location_id'] ?? null;

if (!$locationId) {
    echo json_encode(['status' => 'error', 'message' => 'Fehlende Location-ID']);
    exit;
}

// Prüfen, ob bereits gespeichert
$sql = "SELECT * FROM favorites WHERE users_id = ? AND locations_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$userId, $locationId]);
$exists = $stmt->fetch();

if ($exists) {
    $sql = "DELETE FROM favorites WHERE users_id = ? AND locations_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId, $locationId]);
    echo json_encode(['status' => 'removed']);
} else {
    $sql = "INSERT INTO favorites (locations_id, users_id, created_at) VALUES (?, ?, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$locationId, $userId]);
    echo json_encode(['status' => 'added']);
}
