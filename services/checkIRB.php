<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to check IRB entered for new DUSTER project
 */

$irb_num = $_POST["project_irb_number"];
$irb_status = false;
try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');
    $irb_status = $IRB->isIRBValid($irb_num);
    $irb_status_string = $irb_status === true ? 'true' : 'false';
    $module->emLog("Status for IRB number $irb_num returned by IRB Lookup EM: $irb_status_string.");

} catch(Exception $ex) {
    http_response_code(500);
    $module->emError("Exception when creating an instance of the IRB Lookup EM to look up IRB number $irb_num: $ex");
}
echo $irb_status;
?>
