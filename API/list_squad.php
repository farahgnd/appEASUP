<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Connexion PDO
$pdo = new PDO("mysql:host=localhost;dbname=easup;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    // Récupérer tous les squads triés par date de création
    $stmt = $pdo->query("SELECT id, name, created_at FROM squads ORDER BY created_at DESC");
    $squads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($squads);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>
