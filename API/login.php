<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connexion à la base EASUP
$pdo = new PDO("mysql:host=localhost;dbname=easup;charset=utf8", "root", "");

// Lire les données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';
$password = $data->password ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

// Vérifier si l'utilisateur existe
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit;
}

// Vérifier le mot de passe
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(["success" => false, "message" => "Incorrect password."]);
    exit;
}

// Succès
echo json_encode(["success" => true, "userId" => $user['id']]);
localStorage.setItem('easup_user_id', result.userId.toString());

