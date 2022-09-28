<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */

require_once $module->getModulePath() . "classes/DusterDataRequestClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

$rtoslink_config = new RedcapToStarrLinkConfig($pid, $module, null);
$return_obj = [];

if ($action === 'cohort') {
    $duster_config = new DusterConfigClass($pid, $module);
    $return_obj = $duster_config->getDusterRequestObject();
    $return_obj["queries"]= $rtoslink_config->getQueryNames();
    $return_obj['status'] = 200;
    //$module->emDebug("cohort resp: " . print_r($return_obj, true));
} else if ($action === 'syncCohort') {
    $resp = $rtoslink_config->syncCohort();
    if ($resp) {
        $return_obj['status'] = 200;
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = 'Unable to sync cohort';
    }
} else if ($action === 'getData') {
    $query = isset($_GET['query']) && !empty($_GET['query']) ? $_GET['query'] : null;
    $resp = $rtoslink_config->updateData($query);
    $query = ($query==null)? 'All' : $query;
    //$module->emDebug('$resp = ' . $resp);
    if ($resp) {
        $return_obj['status'] = 200;
        $return_obj['message'] = "Clinical Window $query is complete.";
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = "Unable to update data for query $query";
    }
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
}
echo json_encode($return_obj);
?>
