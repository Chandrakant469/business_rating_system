<?php
include "../config/db.php";

$business_id = $_POST['business_id'];
$name  = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$rating = $_POST['rating'];
$emailCheck = $conn->query("SELECT id FROM ratings WHERE business_id='$business_id' AND email='$email'");
$phoneCheck = $conn->query("SELECT id FROM ratings WHERE business_id='$business_id' AND phone='$phone'");
if ($emailCheck->num_rows > 0) {
    echo json_encode([
        "status" => "email_duplicate"
    ]);
    exit;
}
if ($phoneCheck->num_rows > 0) {
    echo json_encode([
        "status" => "phone_duplicate"
    ]);
    exit;
}
$conn->query("INSERT INTO ratings(business_id,name,email,phone,rating) VALUES('$business_id','$name','$email','$phone','$rating')");
$avg = $conn->query("SELECT ROUND(AVG(rating),1) as avg_rating FROM ratings WHERE business_id='$business_id'")->fetch_assoc();
echo json_encode([
    "status" => "success",
    "business_id" => $business_id,
    "avg_rating" => $avg['avg_rating']
]);
