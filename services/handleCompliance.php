<?php
namespace Stanford\Duster;
use REDCap;

/** @var $module Duster */

$message = $_POST["message"];
//$pds = $_GET["pds"];
$irb_num = $_POST['irb_num'];
$pid = $_GET["pid"];

$module->emLog("compliance notify pid:$pid, irb:$irb_num, message:$message");

try {
        $duster_email = (!empty($module->getSystemSetting("duster-email")))
            ? $module->getSystemSetting("duster-email") : $GLOBALS['homepage_contact_email'];
        if ($pid) {
            $project_title = $module->getProject($pid)->getTitle();
            $subject = "DUSTER Compliance Issues PID $pid ";
        } else {
            $subject = "DUSTER Compliance Issues";
        }
        /*$contacts = explode($pds);
        foreach ($contacts as &$contact) {
            if (!strpos($contact, "@")) {
                $contact += "@stanford.edu";
            }
        }
        unset($contact);
            $email_status = REDCap::email(implode($contacts), $duster_email, $subject, $message);*/
         $email_status = REDCap::email($duster_email, $duster_email, $subject, "PID $pid $message");
         if (!$email_status) {
             $module->emError("DUSTER handleCompliance: Unable to send compliance email", "Email to "
                + "$duster_email Failed. SUBJECT: $subject, MESSAGE: $message");
         }
} catch(Exception $ex) {
    http_response_code(500);
    $module->emError("DUSTER handleCompliance exception: " . $ex->getMessage(), $ex);
}

?>
