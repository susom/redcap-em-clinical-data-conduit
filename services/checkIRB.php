<?php
namespace Stanford\Duster;
use REDCap;

/** @var $module Duster */

/**
 * service page to check IRB entered for new DUSTER project
 * and check user compliance returns following struct:
 * {
 *  irb_num: irb or dpa
 * error: string error message
 * irb_status: boolean // this is a misnomer, could be irb or dpa status
 * user_permissions: personnel struct as defined by redcap-em-irb-lookup
 * privacy_settings: privacy data struct as defined by redcap-em-irb-lookup
 * protocol_directors: array of irb protocol director suids; used to send email addresses if user does not have a dpa.
 * This
 * will
 * be empty in case of DPA only project, but shouldn't be a problem since by definition they already have a DPA.
 * }
 */

$irb_num = $_POST["project_irb_number"];
$username = $module->getUser()->getUsername();

$pid = $_GET["pid"];
$irb_status = [];

try {
    $IRB = \ExternalModules\ExternalModules::getModuleInstance('irb_lookup');

    if (empty($irb_num)) {
        if (!empty($pid)) {
            $irb_num = $IRB->findIRBNumber($pid);
        } else {
            throw new Exception("checkCompliance both irb_num and pid can not be null.");
        }
    }
    $irb_status['irb_num'] = $irb_num;
    $compliance = $IRB->getAllCompliance($irb_num, $pid);
    if ($compliance) {
        $irb_status['irb_status'] = $compliance['isValid'];
        $module->emLog("Status for IRB number $irb_num returned by IRB Lookup EM: "  . $irb_status['irb_status']);

        if ($irb_status['irb_status']) {
            $irb_status['dpa'] = $compliance['dpa'];
            $personnel = $compliance['personnel'];
            // original intent was to send email to pds for dpa violations. Just sending email to duster team now
            //$irb_status['dpa_contacts'] = [];
            foreach ($personnel as $person) {
                if ($person['sunetid'] == $username)
                    $irb_status['user_permissions'] = $person;
                /*if ($person['role'] === 'PD' || $person['role'] === 'COPD')
                    $irb_status['dpa_contacts'][] = $person['sunetid'];*/
            }
            /*if ($compliance['dpa'] && !in_array($compliance['dpa']['primaryUser'], $irb_status['protocol_directors'])) {
                $irb_status['dpa_contacts'][] = $compliance['dpa']['primaryUser'];
            }*/
            if ($pid) {
                // This is a hack because otherwise can't tell if name is queried
                $demographics = REDCAP::getInstrumentNames("demographics");
                if ($demographics) {
                    $fields = REDCap::getFieldNames('demographics');
                    if ($fields && in_array("first_name", $fields)
                        || in_array("last_name", $fields)) {
                        $irb_status['project_has_name'] = true;
                    } else {
                        $irb_status['project_has_name'] = false;
                    }
                }
            }
        }
    } else {
        $irb_status['irb_status'] = false;
        $irb_status['message'] = "Compliance API returns false for IRB $irb_num";
    }
} catch(Exception $ex) {
    http_response_code(500);
    //$module->emError("Exception when creating class irb_lookup");
    $module->emError("Exception checking user compliance. for irb $irb_num; pid $pid; user $username; "
        . $ex->getMessage());
    $irb_status['irb_status'] = false;
    $irb_status['error'] = "Exception checking user compliance. " . $ex->getMessage();
}
$module->emLog("irb_status: "  . print_r($irb_status, true));
echo json_encode($irb_status);
?>
