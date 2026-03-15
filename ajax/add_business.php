<?php
include "../config/db.php";

$name = $_POST['name'];
$address = $_POST['address'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$query = "INSERT INTO businesses(name,address,phone,email) VALUES('$name','$address','$phone','$email')";
$conn->query($query);
$id = $conn->insert_id;
$response = [
    "id" => $id,
    "name" => $name,
    "address" => $address,
    "phone" => $phone,
    "email" => $email
];
echo json_encode($response);
