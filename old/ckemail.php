<?php
$email=$_GET['email'];

$url = "https://report.ptengine.com/ajax/userCheckRepeat.pt";
// $data = array('loginEmail' => $email);
$url = $url . "?loginEmail=" . $email;

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($curl, CURLOPT_POST, 1);
//curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($curl);
curl_close($curl);

/*
$header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
*/

echo $response;
?>
