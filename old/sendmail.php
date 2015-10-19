<?php
function utf16_to_utf8($str) {
  $c0 = ord($str[0]);
  $c1 = ord($str[1]);

  if ($c0 == 0xFE && $c1 == 0xFF) {
    $be = true;
  } else if ($c0 == 0xFF && $c1 == 0xFE) {
    $be = false;
  } else {
    return $str;
  }

  $str = substr($str, 2);
  $len = strlen($str);
  $dec = '';
  for ($i = 0; $i < $len; $i += 2) {
    $c = ($be) ? ord($str[$i]) << 8 | ord($str[$i + 1]) :
      ord($str[$i + 1]) << 8 | ord($str[$i]);
    if ($c >= 0x0001 && $c <= 0x007F) {
      $dec .= chr($c);
    } else if ($c > 0x07FF) {
      $dec .= chr(0xE0 | (($c >> 12) & 0x0F));
      $dec .= chr(0x80 | (($c >>  6) & 0x3F));
      $dec .= chr(0x80 | (($c >>  0) & 0x3F));
    } else {
      $dec .= chr(0xC0 | (($c >>  6) & 0x1F));
      $dec .= chr(0x80 | (($c >>  0) & 0x3F));
    }
  }
  return $dec;
}

// base64_encode(str);

$email = $_POST['email'];
$pw = $_POST['pw'];

/*
$date = new DateTime();
$timestamp = $date->getTimestamp();
 */
$today = (string)date("Y-m-d");

$url = "http://archive.ptengine.com/templets/miapex/php//regSesSendEmail.php";
$link = "https://report.ptengine.com/activation/activation_form.htm?ptengine=";
$link = $link . base64_encode(utf16_to_utf8($email));

$data = array('email' => $email,
  'password' => $pw,
  'link' => $link,
  'date' => $today
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($curl);
curl_close($curl);

echo $response;
//echo json_encode($data);
?>
