<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */
use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

function syncCohort($rtoslink_config) {
    REDCap::logEvent("DUSTER: Sync Cohort");
    $return_obj = array();
    $resp = $rtoslink_config->syncCohort();
    if ($resp) {
        $return_obj['status'] = 200;
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = 'Unable to sync cohort';
    }
    return $return_obj;
}

function getData($rtoslink_config, $query) {
    REDCap::logEvent("DUSTER: Get Data for " . $query);
    $return_obj = array();
    if ($query != null) {
        //$module->emDebug('$query = ' . $query);
        $resp = $rtoslink_config->updateData($query['query_name']);
        $query_label = $query['query_label'];
        //$module->emDebug('$resp = ' . $resp);
        if ($resp) {
            $return_obj['status'] = 200;
            $return_obj['message'] = "Update for $query_label is complete.";
        } else {
            $return_obj['status'] = 400;
            $return_obj['message'] = "Error: Unable to update $query_label";
        }
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = "Missing query parameter.";
    }
    return $return_obj;
}

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

$rtoslink_config = new RedcapToStarrLinkConfig($pid, $module);
$return_obj = array();

if ($action === 'projectStatus') {
    $result = $module->query(
        "select `status` from redcap_projects where `project_id`=?",
        [$pid]);
    if ($result->num_rows > 0) {
        $return_obj['status'] = 200;
        $return_obj['production_status'] = json_decode($result->fetch_assoc()['status'], true);
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
    $return_obj = syncCohort($rtoslink_config);
} else if ($action === 'asyncData') {
    $module->emDebug('$email = ' . print_r($_GET['email'], true));

    $email = (isset($_GET['email']) && !empty($_GET['email']))
        ? $_GET['email'] :
        $module->getSystemSetting("duster-email");
    $query_status = array();
    $query_status['sync_cohort'] = syncCohort($rtoslink_config);
    if ($query_status['sync_cohort']['status'] == 200) {
        $cwqueries = $rtoslink_config->getQueries();
        $module->emDebug('$queries = ' . print_r($cwqueries, true));
        foreach ($cwqueries as $queries) {
            foreach ($queries as $query) {
                $query_name = $query['query_name'];
                $query_status[$query_name] = getData($rtoslink_config, $query);
                $query_status[$query_name]['label'] = $query['query_label'];
                $module->emDebug('$query = ' . $query_name . " : "
                    . print_r($query_status[$query_name], true));
                if ($query_status[$query_name]['status'] != 200) {
                    break;
                }
            }
        }
    }
    //send an email to user
    $message = '<html><body>Your Duster data request is complete.<br>';
    foreach($query_status as $return_obj) {
        $message .= $return_obj['message'] . '<br>';
    }
    $message .= '</body></html>';
    $module->emDebug('$message = ' . $message);
    $module->emDebug('$email = ' . $email);

    // TODO: add a link to the data?
    if (!empty($email)) {
        $emailStatus = REDCap::email($email, 'no-reply@stanford.edu', 'DUSTER data request complete', $message);
        if (!$emailStatus) {
            $this->emError("Email Notification to $email Failed.");
        }
    }
} else if ($action === 'getData') {
    $query = isset($_GET['query']) && !empty($_GET['query']) ? json_decode($_GET['query'], true) : null;
    if ($query != null) {
        $return_obj = getData($rtoslink_config, $query);
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = "Missing query parameter.";
    }
} else if ($action === 'complete') {
    REDCap::logEvent("DUSTER: Get Data Complete");
    $return_obj['status'] = 200;
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
}
echo json_encode($return_obj);

