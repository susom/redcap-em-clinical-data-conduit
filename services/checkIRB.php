<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to check IRB entered for new DUSTER project
 */

$irb_num = $_POST["project_irb_number"];
$irb_status = false;
$irb_all = [];
$irb_privacy = [];
try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');
    $irb_status = $IRB->isIRBValid($irb_num) ? true : false;
    $irb_status_string = $irb_status === true ? 'true' : 'false';
    //$irb_privacy = $IRB->getPrivacySettingsV2($irb_num);
    //$irb_all = $IRB->getAllIRBData($irb_num);
    $module->emLog("Status for IRB number $irb_num returned by IRB Lookup EM: $irb_status_string.");
} catch(Exception $ex) {
    http_response_code(500);
    $module->emError("Exception when creating class irb_lookup");
}
//$module->emLog("IRB status for $irb_num: $status");
//$module->emLog("IRB privacy " . print_r($irb_privacy, true));
//$module->emLog("IRB all " . print_r($irb_all, true));
echo $irb_status;
?>
