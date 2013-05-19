<?php
header('Content-type: application/json');
$apiKEY = $_GET['APIkey'];
$thing = '"X-ApiKey : '.$apiKEY.'"';
$theurl = 'http://api.xively.com/v2/feeds';
$ch = curl_init($theurl);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST'); // -X
curl_setopt($ch, CURLOPT_BINARYTRANSFER, TRUE); // --data-binary
curl_setopt($ch, CURLOPT_HTTPHEADER, array("X-ApiKey:".$apiKEY)); // -H
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0); // -0
curl_setopt($ch, CURLOPT_POSTFIELDS, '{"title":"Newly Created Feed With PHP"}'); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$headers = get_headers_from_curl_response($response);

if (isset($_GET['jsoncallback'])) {
	print $_GET['jsoncallback'] . '(' . JSON_encode($headers) . ')';
} else {
	print JSON_encode($headers);
}

function get_headers_from_curl_response($response)
{
    $headers = array();
    $header_text = substr($response, 0, strpos($response, "\r\n\r\n"));
    foreach (explode("\r\n", $header_text) as $i => $line)
        if ($i === 0)
            $headers['http_code'] = $line;
        else
        {
            list ($key, $value) = explode(': ', $line);
            $headers[$key] = $value;
        }
    return $headers;
}


?>
