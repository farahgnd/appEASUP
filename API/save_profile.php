<?php
// ================= CORS =================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Préflight (IMPORTANT)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(["debug" => "OPTIONS request, exiting"]);
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
    echo json_encode(["debug" => "DB connected successfully"]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "DB connection failed",
        "error" => $e->getMessage()
    ]);
    exit;
}

// ================= DATA =================
$rawData = file_get_contents("php://input");
echo json_encode(["debug" => "Raw input received", "rawData" => $rawData]);

$data = json_decode($rawData, true);

if ($data === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON",
        "rawData" => $rawData
    ]);
    exit;
}

$userId = $data['userId'] ?? null;
$age = $data['age'] ?? null;
$weight = $data['weight'] ?? null;
$height = $data['height'] ?? null;
$activityLevel = $data['activityLevel'] ?? null;
$goal = $data['goal'] ?? null;
$conditions = $data['conditions'] ?? [];

echo json_encode([
    "debug" => "Parsed data",
    "userId" => $userId,
    "age" => $age,
    "weight" => $weight,
    "height" => $height,
    "activityLevel" => $activityLevel,
    "goal" => $goal,
    "conditions" => $conditions
]);

// Vérification des champs obligatoires
if ($userId === null || $age === null || $weight === null || $height === null) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields",
        "userId" => $userId,
        "age" => $age,
        "weight" => $weight,
        "height" => $height
    ]);
    exit;
}

// ================= INSERT PROFILE =================
try {
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

    $stmt->execute([$userId, $age, $weight, $height, $activityLevel, $goal]);
    echo json_encode(["debug" => "Profile inserted/updated successfully"]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert/update profile",
        "error" => $e->getMessage()
    ]);
    exit;
}

// ================= INSERT CONDITIONS =================
if (!empty($conditions)) {
    try {
        $stmtCond = $pdo->prepare("
            INSERT INTO user_conditions (user_id, condition_name)
            VALUES (?, ?)
        ");
        foreach ($conditions as $cond) {
            $stmtCond->execute([$userId, $cond]);
            echo json_encode(["debug" => "Condition inserted", "condition" => $cond]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to insert conditions",
            "error" => $e->getMessage()
        ]);
        exit;
    }
} else {
    echo json_encode(["debug" => "No conditions to insert"]);
}

// ================= RESPONSE =================
echo json_encode([
    "success" => true,
    "message" => "Profile saved successfully"
]);
?>
