<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");  // Pour autoriser React
header("Access-Control-Allow-Headers: Content-Type");

// Connexion à la base EASUP
$pdo = new PDO("mysql:host=localhost;dbname=easup;charset=utf8", "root", ""); // change le mot de passe si nécessaire

// Lire les données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';
$password = $data->password ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

// Vérifier si l'email existe déjà
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists."]);
    exit;
}

// Hachage du mot de passe
$hash = password_hash($password, PASSWORD_BCRYPT);

// Insérer l'utilisateur dans la table
$stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
$stmt->execute([$email, $hash]);

echo json_encode(["success" => true, "message" => "User created successfully."]);
