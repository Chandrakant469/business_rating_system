<?php

include "../config/db.php";

$id = $_POST['id'];
$name = $_POST['name'];
$address = $_POST['address'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$query = "UPDATE businesses SET name='$name', address='$address', phone='$phone', email='$email' WHERE id='$id'";
$conn->query($query);
$response = [
    "id" => $id,
    "name" => $name,
    "address" => $address,
    "phone" => $phone,
    "email" => $email
];

echo json_encode($response);
