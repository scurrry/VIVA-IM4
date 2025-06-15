<?php
session_start();
header('Content-Type: application/json');
require_once '../system/config.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email']; // optional

    echo json_encode([
        "status" => "success",
        "user_id" => $user['id']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Login-Daten"]);
}
