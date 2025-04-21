<?php
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$imageData = $data['image'] ?? null; // Base64 string of the image
$createdAt = $data['created_at'] ?? null; // The creation timestamp

// Validate the input
if (!$imageData || !$createdAt) {
    echo json_encode(['message' => 'Missing image or creation date.']);
    exit;
}

// Remove the "data:image/jpeg;base64," part of the string
$imageData = str_replace('data:image/jpeg;base64,', '', $imageData);
$imageData = base64_decode($imageData); // Decode base64 to binary data

// Generate a unique filename for the image
$filename = 'captured_image_' . time() . '.jpg';

// Define the path to save the image
$imagePath = 'uploads/' . $filename;

// Save the image to the server
if (file_put_contents($imagePath, $imageData)) {
    // Here, you can save the image info to the database (e.g., creation date, filename)
    // Assuming a MySQL database connection is already set up
    $conn = new mysqli('localhost', 'root', '', 'your_database_name'); // Update with your database credentials
    if ($conn->connect_error) {
        echo json_encode(['message' => 'Database connection failed.']);
        exit;
    }

    $stmt = $conn->prepare('INSERT INTO images (filename, created_at) VALUES (?, ?)');
    $stmt->bind_param('ss', $filename, $createdAt);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Image saved successfully!']);
    } else {
        echo json_encode(['message' => 'Error saving to the database.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['message' => 'Failed to save image.']);
}
?>
