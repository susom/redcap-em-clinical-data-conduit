<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to check IRB entered for new DUSTER project
 */

$irb_num = $_POST["project_irb_number"];
$status = false;
try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');
    $status = $IRB->isIRBValid($irb_num) ? true : false;
} catch(Exception $ex) {
    $module->emError("Exception when creating class irb_lookup");
}
$module->emLog("IRB status for $irb_num: $status");
echo $status;
?>
