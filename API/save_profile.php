<?php
// ================= CORS =================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Préflight (IMPORTANT)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= DB =================
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=easup;charset=utf8",
        "root",
        ""
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]);
    exit;
}

// ================= DATA =================
$data = json_decode(file_get_contents("php://input"), true);

$userId = $data['userId'] ?? null;
$age = $data['age'] ?? null;
$weight = $data['weight'] ?? null;
$height = $data['height'] ?? null;
$activityLevel = $data['activityLevel'] ?? null;
$goal = $data['goal'] ?? null;
$conditions = $data['conditions'] ?? [];

if (!$userId || !$age || !$weight || !$height) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

// ================= INSERT PROFILE =================
$stmt = $pdo->prepare("
    INSERT INTO user_profiles 
    (user_id, age, weight, height, activity_level, goal)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        age = VALUES(age),
        weight = VALUES(weight),
        height = VALUES(height),
        activity_level = VALUES(activity_level),
        goal = VALUES(goal)
");


$stmt->execute([
    $userId,
    $age,
    $weight,
    $height,
    $activityLevel,
    $goal
]);

// ================= INSERT CONDITIONS =================
if (!empty($conditions)) {
    $stmtCond = $pdo->prepare("
        INSERT INTO user_conditions (user_id, condition_name)
        VALUES (?, ?)
    ");

    foreach ($conditions as $cond) {
        $stmtCond->execute([$userId, $cond]);
    }
}

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "message" => "Profile saved successfully"
]);
