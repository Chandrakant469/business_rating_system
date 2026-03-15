<?php

include "../config/db.php";

$id = $_POST['id'];

$conn->query("DELETE FROM businesses WHERE id='$id'");
$conn->query("DELETE FROM ratings WHERE business_id='$id'");

echo "success";

?>