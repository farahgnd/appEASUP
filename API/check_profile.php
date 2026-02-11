<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Connexion DB
$pdo = new PDO(
    "mysql:host=localhost;dbname=easup;charset=utf8",
    "root",
    ""
);

// 🔥 LIRE DEPUIS L’URL (GET)
$userId = $_GET['userId'] ?? null;

if (!$userId) {
    echo json_encode(["hasProfile" => false]);
    exit;
}

// Vérifier si un profil existe
$stmt = $pdo->prepare("SELECT id FROM user_profiles WHERE user_id = ?");
$stmt->execute([$userId]);

$exists = $stmt->fetch() ? true : false;

echo json_encode([
    "hasProfile" => $exists
]);
