<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to check IRB entered for new DUSTER project
 */

$irb_num = $_POST["project_irb_number"];
$module->emLog("Looking up IRB number $irb_num.");
$irb_status = false;
$irb_status_string = 'false';
// $irb_all = [];
// $irb_privacy = [];
try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');
    $irb_status = $IRB->isIRBValid($irb_num);
    $irb_status_string = $irb_status === true ? 'true' : 'false';
    $module->emLog("Status for IRB number {$irb_num} returned by IRB Lookup EM: {$irb_status_string}.");
    // $status = $IRB->isIRBValid($irb_num) ? true : false;
    //$irb_privacy = $IRB->getPrivacySettingsV2($irb_num);
    //$irb_all = $IRB->getAllIRBData($irb_num);

} catch(Exception $ex) {
    $module->emError("Exception when creating an instance of the IRB Lookup EM.");
}
//$module->emLog("IRB status for $irb_num: $status");
// $module->emLog("IRB privacy " . print_r($irb_privacy, true));
//$module->emLog("IRB all " . print_r($irb_all, true));
$module->emLog("Returning {$irb_status_string} status for IRB number {$irb_num}.");
echo $irb_status;
?>
