<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connexion PDO
$pdo = new PDO("mysql:host=localhost;dbname=easup;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Récupérer les données JSON envoyées par React
$data = json_decode(file_get_contents("php://input"));
$squad_id = $data->squad_id ?? 0;
$user_id  = $data->user_id ?? 0;

if (!$squad_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants']);
    exit;
}

try {
    // Vérifier si l'utilisateur est déjà membre
    $stmt = $pdo->prepare("SELECT id FROM squad_members WHERE squad_id = ? AND user_id = ?");
    $stmt->execute([$squad_id, $user_id]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        echo json_encode(['success' => true, 'message' => 'Déjà membre']);
        exit;
    }

    // Ajouter l'utilisateur au squad
    $stmt = $pdo->prepare("INSERT INTO squad_members (squad_id, user_id) VALUES (?, ?)");
    $stmt->execute([$squad_id, $user_id]);

    echo json_encode(['success' => true, 'message' => 'Rejoint avec succès']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>
