<?php
header('Content-type: application/json');
$apiKEY = $_GET['APIkey'];
//$apiKEY = "JOxnIA8lNaXSQ1aTWFrG4lF6s9aSAKxEbERVNEE5NHZNQT0g";
$q = $_GET['question'];
$maxCount = $_GET['maxCount'];
//$maxCount = 50;
//$apiKEY = "JOxnIA8lNaXSQ1aTWFrG4lF6s9aSAKxEbERVNEE5NHZNQT0g";
//$q = "arduino";
$theurl = "http://api.xively.com/v2/feeds";
$returnJSON = array();
$ch = curl_init($theurl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
// -X
curl_setopt($ch, CURLOPT_BINARYTRANSFER, TRUE);
// --data-binary
curl_setopt($ch, CURLOPT_HTTPHEADER, array("X-ApiKey:" . $apiKEY));
// -H
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
// -0
//curl_setopt($ch, CURLOPT_POSTFIELDS, "key=".$apiKEY);
curl_setopt($ch, CURLOPT_POSTFIELDS, "per_page=100&q=" . $q . "&order=created_at&status=live");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);

$response = curl_exec($ch);


$response_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$response = substr($response, $response_size);
//echo($response);
$response = JSON_decode($response, true);
//print_r($response);
//print_r(sizeof($response["results"]));
if(array_key_exists("results",$response)){
if (sizeof($response["results"]) >= $maxCount) {
	while (sizeof($returnJSON) < $maxCount) {
		for ($i = 0; $i < sizeof($response["results"]); $i++) {
			if (array_key_exists("location", $response["results"][$i])) {
				if (array_key_exists("lon", $response["results"][$i]["location"]) && array_key_exists("lat", $response["results"][$i]["location"])) {
					if ($response["results"][$i]["location"]["lon"] != 0 && $response["results"][$i]["location"]["lat"] != 0) {
						if (sizeof($response["results"][$i]["datastreams"]) > 0) {
							array_push($returnJSON, $response["results"][$i]);
							if (sizeof($returnJSON) >= $maxCount) {
								break;
							}
						}

					}
				}
			}
		}
	}
}

else{
		for ($i = 0; $i < sizeof($response["results"]); $i++) {
			if (array_key_exists("location", $response["results"][$i])) {
				if (array_key_exists("lon", $response["results"][$i]["location"]) && array_key_exists("lat", $response["results"][$i]["location"])) {
					if ($response["results"][$i]["location"]["lon"] != 0 && $response["results"][$i]["location"]["lat"] != 0) {
						if (sizeof($response["results"][$i]["datastreams"]) > 0) {
							array_push($returnJSON, $response["results"][$i]);
						}

					}
				}
			}
		}
}
}
//print_r($returnJSON);
//echo($response);
//var_dump($response);
if (isset($_GET['jsoncallback'])) {
	print $_GET['jsoncallback'] . '(' . JSON_encode($returnJSON) . ')';
} else {
	print JSON_encode($returnJSON);
}
?>
