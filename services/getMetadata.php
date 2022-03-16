<?php
namespace Stanford\Duster;
/** @var $module Duster */

// use REDCap;
use Exception;

/*
echo $_POST["app_title"];
echo $_POST["purpose"];
echo $_POST["project_note"];
*/

// newProject.pho?action=getMetadata
/*
if ($_GET["action"] == "getMetadata") {
    // do everything ro run the metadata api call
    print($resp)
    return
}
*/
// build and send POST request to metadata webservice
$metadata_url = $module->getSystemSetting("starrapi-metadata-url");

try {
    $tokenMgnt = \ExternalModules\ExternalModules::getModuleInstance('vertx_token_manager');
    $token = $tokenMgnt->findValidToken('ddp');
} catch (Exception $ex) {
    $module->emError("Could not find a valid token for service ddp");
    $token = false;
}
if($token !== false) {
    $curl = curl_init($metadata_url);
    curl_setopt($curl, CURLOPT_URL, $metadata_url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $headers = array(
        "Accept: application/json",
        "Content-Type: application/json",
        "Authorization: Bearer " . $token
    );
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

    $data = <<<DATA
    {
    }
    DATA;

    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

    $resp = curl_exec($curl);
    curl_close($curl);
    $resp_arr = json_decode($resp, true);
    $fields_arr = $resp_arr["results"];

    $demographics_arr = [];
    $outcomes_arr = [];
    $labs_arr = [];
    $vitals_arr = [];
    $scores_arr = [];
    $oxygenation_arr = [];
    foreach ($fields_arr as $field) {
        switch ($field["category"]) {
            case "Demographics":
                array_push($demographics_arr, $field);
                break;
            case "Outcomes":
                array_push($outcomes_arr, $field);
                break;
            case "Labs":
                array_push($labs_arr, $field);
                break;
            case "Vitals":
                array_push($vitals_arr, $field);
                break;
            case "Scores":
                array_push($scores_arr, $field);
                break;
            case "Oxygenation":
                array_push($oxygenation_arr, $field);
                break;
            default: // TODO error?
        }
    }
}
$metadata = array(
    "demographics" => $demographics_arr,
    "outcomes" => $outcomes_arr,
    "labs" => $labs_arr,
    "vitals" => $vitals_arr,
    "scores" => $scores_arr,
    "oxygenation" => $oxygenation_arr
);
$module->emLog(json_encode($metadata));
echo json_encode($metadata);

/*$module->emLog($demographics_arr);
$module->emLog($outcomes_arr);
$module->emLog($labs_arr);
$module->emLog($vitals_arr);
$module->emLog($scores_arr);
$module->emLog($oxygenation_arr);*/
// echo $_POST["app_title"];

?>
