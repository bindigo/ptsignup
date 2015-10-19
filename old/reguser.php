<?php
//$str = file_get_contents("php://input");
//$arr = array();
//parse_str($str, $arr);
// $arr['email'], $arr['pw']
$email = $_POST['email'];
$pw = $_POST['pw'];

$date = new DateTime();
$timestamp = $date->getTimestamp();

$data = array('email' => $email,
  'password' => $pw,
  'timestamp' => $timestamp
);

$url = "http://archive.ptengine.com/templets/miapex/php/registe.php";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($curl);
curl_close($curl);

/*
$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
*/

echo $response;
?>
