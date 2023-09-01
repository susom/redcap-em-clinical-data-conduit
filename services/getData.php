<?php
namespace Stanford\Duster;
/** @var $module Duster */

use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;

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

function getRequestId($pid){
    global $module;
    // TODO: need to add request status to synchronized requests
    $request_id = $module->getProjectSetting('requestId', $pid); // returns integer
    if (!$request_id) {
        $request_id = 0;
    }
    return $request_id;
}

function logToServer($pid, $query_name, $message) {
    global $module;
    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log";
    $post_fields['user'] = $module->getUser()->getUserName();
    $post_fields['pid'] = $pid;
    $post_fields['query_name'] = $query_name;
    $post_fields['message'] = $message;
    $response = $module->starrApiPostRequest($log_url, 'ddp', $post_fields);
    return $response;
}

function getRequestStatus($pid) {
    global $module;
    // TODO: need to add request status to synchronized requests
    $request_id = getRequestId($pid); // returns integer
    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log/" . SERVER_NAME
        . "/$pid/$request_id/status?user=" . $module->getUser()->getUserName();
    // should return the request id and status 'sync','async', 'complete', 'cancel', 'fail: <message>'
    $request_status = $module->starrApiGetRequest($log_url, 'ddp');
    $module->emDebug("log_url = $log_url");
    $module->emDebug("request_status = " . print_r($request_status, true));
    /*$return_obj['dataRequestStatus'] = $return_status['dataRequestStatus'];
    $return_obj['dataRequestTimestamp'] = $return_status['dataRequestTimestamp'];
    $return_obj['redcapUserName'] = $return_status['redcapUserName'];

    $return_obj['status'] = $return_status['status'];*/
    return $request_status;
}

function emailAsyncStatus($request_log) {
    global $module, $pid;
    $module->emDebug('$email = ' . $_GET['email']);

    $email = (isset($_GET['email']) && !empty($_GET['email']))
        ? $_GET['email'] :
        $module->getProjectSetting('dataUpdateNotify', $pid);

    //send an email to user
    $redcap_version = explode('_',APP_PATH_WEBROOT)[1];
    $data_exports_url = APP_PATH_WEBROOT_FULL
        . 'redcap_' . $redcap_version .'DataExport/index.php?pid=' . $pid;
    $message = '<html><body>Your Duster data request is complete.<br>';
    foreach($request_log as $form_name=>$form_status) {
        foreach($form_status['queries'] as $query_name=>$query_status) {
            $message .= $query_status['message'] . '<br>';
            /*} else {
                $message .= '<span style="color:red">'. fixLabel($return_obj['label']) . ' failed.</span><br>';
            }*/
        }
    }
    // Add a link to the redcap project
    $message .= "<a href=\"$data_exports_url\">View data in redcap.</a>";
    $message .= '</body></html>';
    $module->emDebug('$message = ' . $message);
    $module->emDebug('$email = ' . $email);

    if (!empty($email)) {
        $emailStatus = REDCap::email($email, 'no-reply@stanford.edu', 'DUSTER data request complete', $message);
        if (!$emailStatus) {
            $module->emError("Email Notification to $email Failed.");
        }
    }
}

/* build the request log structure to return to async status requests*/
function initRequestLog($forms) {
    $request_log = [];
    $request_log['researcher_provided_information']['form_name'] = 'researcher_provided_information';
    $request_log['researcher_provided_information']['num_queries'] = 1;
    $request_log['researcher_provided_information']['num_complete'] = 0;
    $request_log['researcher_provided_information']['complete'] = false;
    $request_log['researcher_provided_information']['queries']['cohort sync']['query_name'] = 'cohort sync';
    $request_log['researcher_provided_information']['queries']['cohort sync']['message'] = 'not started';
    $request_log['researcher_provided_information']['queries']['cohort sync']['order'] = 0;

    foreach($forms as $form_name => $form_queries) {
        $request_log[$form_name]['form_name'] = $form_name;
        $request_log[$form_name]['num_queries'] = count($form_queries);
        $request_log[$form_name]['num_complete'] = 0;
        $request_log[$form_name]['complete'] = false;
        for ($i = 0; $i < sizeof($form_queries); $i++) {
            $key = $form_queries[$i]['query_name'];
            $request_log[$form_name]['queries'][$key] = $form_queries[$i];
            $request_log[$form_name]['queries'][$key]['message'] = 'not started';
            $request_log[$form_name]['queries'][$key]['order'] = $i;
        }
    }
    return $request_log;
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

$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

$rtoslink_config = new RedcapToStarrLinkConfig($pid, $module);
$return_obj = array();

if ($action === 'productionStatus') {
    // check that redcap project is in production status
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
    // populate the cohort for get-data
    REDCap::logEvent("DUSTER: Get Data Start");
    $duster_config = new DusterConfigClass($pid, $module);
    $return_obj = $duster_config->getDusterRequestObject();
    $return_obj["queries"]= $rtoslink_config->getQueries();
    $module->emDebug('rtos queries: ' . print_r($return_obj["queries"], true));
    $num_queries = 0;
    foreach( $return_obj["queries"] as $query) {
        $num_queries += count($query);
    }
    $return_obj['num_queries'] = $num_queries;
    $return_obj['status'] = 200;
} else if ($action === 'syncCohort') {
    // real time rtos link cohort sync
    $in_progress = getRequestStatus($pid);
    $module->emDebug("in_progress = $in_progress");
    // request id is used to distinguish between different get data requests
    $request_id = getRequestId($pid);
    if ($in_progress === 'complete' || 'no status') {
        $request_id = $request_id + 1;
        $module->setProjectSetting('requestId', $request_id, $pid);
        logToServer($pid, "status::" . $request_id, 'sync');
        $return_obj = syncCohort($rtoslink_config);
    }
} else if ($action === 'getData') {
    // real time rtos data request
    $query = isset($_GET['query']) && !empty($_GET['query']) ? json_decode($_GET['query'], true) : null;
    if ($query != null) {
        $return_obj = getData($rtoslink_config, $query);
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = "Missing query parameter.";
    }
} else if ($action === 'dataRequestStatus') {
    // check if there's an ongoing data request
    $return_obj = getRequestStatus($pid);
} else if ($action === 'asyncDataRequest') {
    // background data request
    $in_progress = getRequestStatus($pid);
    $module->emDebug("in_progress = " . print_r($in_progress, true));
    // request id is used to distinguish between different get data requests
    $request_id = getRequestId($pid);
    if ($in_progress['dataRequestStatus'] === 'complete' || 'no status' || 'cancel') {
        $request_id = $request_id + 1;
        $module->setProjectSetting('requestId', $request_id, $pid);
        $module->emDebug(' IN ASYNC requestId=' . getRequestId($pid) . ' ' . $request_id);
        $module->emDebug('$email = ' . $_GET['email']);

        $email = (isset($_GET['email']) && !empty($_GET['email']))
            ? $_GET['email'] :
            $module->getSystemSetting("duster-email");
        $module->setProjectSetting('dataUpdateNotify', $email, $pid);
        $post_fields['redcap_url'] = APP_PATH_WEBROOT_FULL;
        $post_fields['user'] = $module->getUser()->getUserName();
        $post_fields['email'] = $email;
        $post_fields['pid'] = $pid;
        $post_fields['request_id'] = $request_id;
        $post_fields['queries'] = $rtoslink_config->getQueries();
        $duster_api_url = $module->getSystemSetting("starrapi-data-url");

        $module->starrApiPostRequest($duster_api_url, 'ddp', $post_fields, true);
        $module->emDebug('RETURNED FROM IN ASYNC requestId=' . getRequestId($pid) . ' ' . $request_id);
        $return_obj['request_id'] = $request_id;
    }
} else if ($action === 'asyncDataLog') {
    // return logs for an on-going async request
    $request_id = $module->getProjectSetting('requestId', $pid); // returns integer
    $module->emDebug("log request id = $request_id");
    $forms = $rtoslink_config->getQueries();

    // build the response object. add researcher_provided_information first
    $request_log = initRequestLog($forms);

    // now actually get the request status from the server
    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log/" . SERVER_NAME . "/$pid/$request_id?user="
        . $module->getUser()->getUserName();
    $module->emDebug("request log url pre = $request_log");
    $return_logs = $module->starrApiGetRequest($log_url, 'ddp');

    // map the response messages into queries
    $num_queries = 0;
    $num_complete = 0;
    foreach($return_logs as $form_name => $form_status) {
        for ($i = 0; $i < sizeof($form_status['queries']); $i++) {
            $query_name = $form_status['queries'][$i]['query_name'];
            if ($query_name == 'complete') {
                $request_log[$form_name]['complete'] = true;
            } else {
                $request_log[$form_name]['queries'][$query_name]['message'] = $form_status['queries'][$i]['message'];
                $request_log[$form_name]['queries'][$query_name]['log_dttm'] = $form_status['queries'][$i]['log_dttm'];
                $request_log[$form_name]['last_message'] = $form_status['queries'][$i]['message'];
                $request_log[$form_name]['last_logdttm'] = $form_status['queries'][$i]['log_dttm'];

                if (strpos($form_status['queries'][$i]['message'], ' ended') > -1) {
                    $request_log[$form_name]['num_complete'] = $request_log[$form_name]['num_complete'] + 1;
                    // form is complete if num_queries = num_complete
                    $request_log[$form_name]['complete'] = ($request_log[$form_name]['num_complete'] ===
                        $request_log[$form_name]['num_queries']);
                }
            }
        }
        $num_queries += $request_log[$form_name]['num_queries'];
        $num_complete += $request_log[$form_name]['num_complete'];
    }
    //$module->emDebug("log response = ". print_r($return_logs, true));
    $return_obj['data_request_log'] = $request_log;
    $return_obj['num_queries'] = $num_queries;
    $return_obj['num_complete'] = $num_complete;
    $module->emDebug("return_obj = ". print_r($return_obj, true));
    //$return_obj['status'] = $return_obj['status'];
} else if ($action === 'logStatus') {
    // save data request status to duster log table
    // if in sync mode, use to log complete to the duster log table
    // logStatus with status::cancel will cancel async data request
    $status = isset($_GET['status']) && !empty($_GET['status']) ? $_GET['status'] : null;
    $request_id = getRequestId($pid);
    $return_obj = logToServer($pid, "status::" . $request_id, $status);
} else if ($action === 'emailComplete') {

    $email = isset($_GET['email']) && !empty($_GET['email']) ? $_GET['email'] : null;
    if (isset($email)) {
        $module->emDebug('email status');
        $message = "Duster data request is complete.  ";
        // Add a link to the redcap project
        $redcap_version = explode('_',APP_PATH_WEBROOT)[1];
        $data_exports_url = APP_PATH_WEBROOT_FULL
            . 'redcap_' . $redcap_version .'DataExport/index.php?pid=' . $pid;
        $message .= "<a href=\"$data_exports_url\">View data in redcap.</a>";
        $message .= '</body></html>';
        $module->emDebug('$message = ' . $message);
        $module->emDebug('$email = ' . $email);

        if (!empty($email)) {
            $return_obj = REDCap::email($email, 'no-reply@stanford.edu', 'DUSTER data request complete', $message);
            if (!$return_obj) {
                $module->emError("Email Notification to $email Failed.");
            }
        }
    }
    REDCap::logEvent("DUSTER: Async Get Data Complete");
} else if ($action === 'complete') {
    REDCap::logEvent("DUSTER: Get Data Complete");
    $return_obj['status'] = 200;
} else {
    $module->emDebug("Unrecognized action: $action");

    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
}
echo json_encode($return_obj);
