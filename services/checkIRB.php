<?php
namespace Stanford\Duster;
/** @var $module Duster */

$irb_num = $_POST["project_irb_number"];
$status = false;
try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');
    // $privacy_settings = $IRB->getPrivacySettings($irb_num, $pid); // IMPORTANT- cannot use this function for creating a new project
                                                                     // since it requires a project id param
    $status = $IRB->isIRBValid($irb_num) ? true : false;
} catch(Exception $ex) {
    $module->emError("Exception when creating class irb_lookup");
}
// $module->emDebug("IRB status {$status}");
echo $status;
?>
