<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */
use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

$rtoslink_config = new RedcapToStarrLinkConfig($pid, $module);
$return_obj = array();

if ($action === 'projectStatus') {
    $module->emDebug('check projectStatus');
    $result = $module->query(
        "select `status` from redcap_projects where `project_id`=?",
        [$pid]);
    if ($result->num_rows > 0) {
        $return_obj['status'] = 200;
        $return_obj['production_mode'] = json_decode($result->fetch_assoc()['status'], true);
        $module->emDebug('check projectStatus return_obj ' . print_r($return_obj, true));
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = 'Unable to verify project status';
    }
} else if ($action === 'cohort') {
    REDCap::logEvent("DUSTER: Get Data Start");
    $duster_config = new DusterConfigClass($pid, $module);
    $return_obj = $duster_config->getDusterRequestObject();
    $return_obj["queries"]= $rtoslink_config->getQueries();
    $num_queries = 0;
    foreach( $return_obj["queries"] as $query) {
        $num_queries += count($query);
    }
    $return_obj['num_queries'] = $num_queries;
    $return_obj['status'] = 200;
} else if ($action === 'syncCohort') {
    $resp = $rtoslink_config->syncCohort();
    if ($resp) {
        $return_obj['status'] = 200;
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = 'Unable to sync cohort';
    }
} else if ($action === 'getData') {
    $query = isset($_GET['query']) && !empty($_GET['query']) ? json_decode($_GET['query'], true) : null;
    //$module->emDebug('$query = ' . $query);
    $resp = $rtoslink_config->updateData($query['query_name']);
    $query_label = ($query == null) ? 'All' : $query['query_label'];
    //$module->emDebug('$resp = ' . $resp);
    if ($resp) {
        $return_obj['status'] = 200;
        $return_obj['message'] = "Update for $query_label is complete.";
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = "Error: Unable to update $query_label";
    }
} else if ($action === 'complete') {
    REDCap::logEvent("DUSTER: Get Data Complete");
    $return_obj['status'] = 200;
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
}
echo json_encode($return_obj);

