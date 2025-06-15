<?php
session_start();
require_once __DIR__ . '/../system/config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Kategorie aus der URL holen
$category = $_GET['category'] ?? '';

try {
$sql = "SELECT id, name, address, description, image1, image2, image3, link FROM locations WHERE category = :category";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['category' => $category]);

    $locations = $stmt->fetchAll();
    echo json_encode($locations);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Abrufen der Daten: ' . $e->getMessage()]);
}
