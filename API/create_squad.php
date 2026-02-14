<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Inclure la connexion PDO
$pdo = new PDO("mysql:host=localhost;dbname=easup;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Récupérer le nom du squad envoyé par POST (JSON)
$data = json_decode(file_get_contents("php://input"));
$name = $data->name ?? '';

if (!$name) {
    echo json_encode(['success' => false, 'message' => 'Nom du squad requis']);
    exit;
}

try {
    // Vérifier si le squad existe déjà
    $stmt = $pdo->prepare("SELECT id FROM squads WHERE name = ?");
    $stmt->execute([$name]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        echo json_encode(['success' => false, 'message' => 'Squad déjà existant']);
        exit;
    }

    // Créer le nouveau squad
    $stmt = $pdo->prepare("INSERT INTO squads (name, created_at) VALUES (?, NOW())");
    $stmt->execute([$name]);
    $squadId = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'squad_id' => $squadId]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>
