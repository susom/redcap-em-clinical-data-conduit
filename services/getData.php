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

function setRequestId($request_id, $pid) {
    global $module;
    $module->emDebug('setRequestId = '. $request_id);
    //$module->db_query("SET AUTOCOMMIT=0");
    //$module->db_query("BEGIN");
    $response = $module->query('UPDATE redcap_external_module_settings set `value`=? where `project_id`=? and `key`=?',[$request_id, $pid, 'requestId']);
    //$module->setProjectSetting('requestId', $request_id, $pid);
    //$module->db_query("COMMIT");
    //$module->db_query("SET AUTOCOMMIT=1");
    $module->emDebug($response);
    $module->emDebug('setRequestId get = '. getRequestId($pid));
}

function getRequestId($pid){
    global $module, $external_module_id;
    //$rid = $module->getProjectSetting('requestId', $pid);
    if (!isset($external_module_id)) {
        $external_module_result = $module->query('SELECT external_module_id FROM redcap_external_modules WHERE directory_prefix = ?', ['duster']);
        $external_module_id = $external_module_result->fetch_assoc()['external_module_id'];
    }
    $request_id = $module->query('SELECT `value` FROM redcap_external_module_settings WHERE `external_module_id` = ? and `project_id`=? and `key`=? and `type`=?',
        [$external_module_id, $pid, 'requestId', 'integer']);
    //$module->emDebug('request_id=' . print_r($request_id->fetch_assoc(), true));
    // TODO: need to add request status to synchronized requests
    $rid = $request_id->fetch_assoc()['value'];
    $module->emDebug("request_id=$rid");
    //$request_id = $module->getProjectSetting('requestId', $pid); // returns integer
    if (!isset($rid) ) {
        //setRequestId(0, $pid);
        $rid = 0;
        //$module->db_query("SET AUTOCOMMIT=0");
        //$module->db_query("BEGIN");
        //$module->setProjectSetting('requestId', 0, $pid);
        $module->query('insert into redcap_external_module_settings (`project_id`,`external_module_id`,`key`,`type`,
        `value`) values (?,?,?,?,?) ',
            [$pid, $external_module_id, 'requestId', 'integer', $rid]);
        //$module->db_query("COMMIT");
        //$module->db_query("SET AUTOCOMMIT=1");
    }
    return $rid;
}

function logToStarrApi($pid, $query_name, $message) {
    global $module;
    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log";
    $post_fields['user'] = $module->getUser()->getUserName();
    $post_fields['pid'] = $pid;
    $post_fields['query_name'] = $query_name;
    $post_fields['message'] = $message;
    $response = $module->starrApiPostRequest($log_url, 'ddp', $post_fields);
    possibleResponseError($log_url . 'POST FIELDS: ' . print_r($post_fields, true), $response);
    return $response;
}

function possibleResponseError($url, $response) {
    global $module;
    if (isset($response['status']) && $response['status'] != 200) {
        $module->handleError('Duster getData: Starr API request failed', "ERROR: $url  STATUS:". $response['status'] . " MESSAGE:" . $response['message']);
    }
}

// should return the request status 'no status', 'sync','async', 'complete', 'cancel', 'fail: <message>'
function getRequestStatus($pid) {
    global $module;
    // TODO: need to add request status to synchronized requests
    $request_id = getRequestId($pid); // returns integer
    $module->emDebug("request_id = $request_id");

    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log/" . SERVER_NAME
        . "/$pid/$request_id/status?user=" . $module->getUser()->getUserName();
    $request_status = $module->starrApiGetRequest($log_url, 'ddp');
    possibleResponseError($log_url, $request_status);
    //$module->emDebug("log_url = $log_url");
    $module->emDebug("request_status = " . print_r($request_status, true));
    return $request_status;
}

/* build the request log structure to return to async status requests*/
function initRequestLog($forms) {
    $request_log = [];
    $request_log['researcher_provided_information']['form_name'] = 'researcher_provided_information';
    $request_log['researcher_provided_information']['num_queries'] = 1;
    $request_log['researcher_provided_information']['num_complete'] = 0;
    $request_log['researcher_provided_information']['complete'] = false;
    foreach($forms as $form_name => $form_queries) {
        $request_log[$form_name]['form_name'] = $form_name;
        $request_log[$form_name]['num_queries'] = count($form_queries);
        $request_log[$form_name]['num_complete'] = 0;
        $request_log[$form_name]['complete'] = false;
    }
    return $request_log;
}

function getData($rtoslink_config, $query) {
    global $module;
    REDCap::logEvent("DUSTER: Get Data for " . $query['query_name']);
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
            $return_obj['message'] = $module->handleError('Duster getData: Unable to retrieve data', "Error: Unable to update $query_label");
        }
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = $module->handleError('Duster getData: Unable to retrieve data',
            "Missing query parameter.");;
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
        $return_obj['message'] = $module->handleError('Duster getData: Unable to verify project status', 'Unable to verify production status.');
    }
} else if ($action === 'cohort') {
    // populate the cohort for get-data
    REDCap::logEvent("DUSTER: Get Data loaded");
    $duster_config = new DusterConfigClass($pid, $module);
    $return_obj = $duster_config->getDusterRequestObject();
    if (isset($return_obj['status']) && $return_obj['status'] != 200) {
        $msg = $module->handleError('Duster getData: Unable to get cohort', $return_obj['message']);
        $return_obj['message'] = $msg;
    } else {
        $return_obj["queries"] = $rtoslink_config->getQueries();
        $module->emDebug('rtos queries: ' . print_r($return_obj["queries"], true));
        $num_queries = 0;
        foreach ($return_obj["queries"] as $query) {
            $num_queries += count($query);
        }
        if ($num_queries) {
            $return_obj['num_queries'] = $num_queries;
            $return_obj['status'] = 200;
        } else {
            $return_obj['status'] = 400;
            $return_obj['message'] = handleError('Duster getData: No configured queries', 'This project does not have any configured queries.');
        }
    }
} else if ($action === 'dataRequestStatus') {
    // check if there's an ongoing data request
    $return_obj = getRequestStatus($pid);
} else if ($action === 'realTimeSyncCohort') {
    // real time rtos link cohort sync
    $in_progress = getRequestStatus($pid);
    $module->emDebug("in_progress = $in_progress");
    // request id is used to distinguish between different get data requests
    $request_id = getRequestId($pid);
    if ($in_progress === 'complete' || 'no status') {
        $request_id = $request_id + 1;
        setRequestId($request_id, $pid);
        //$module->setProjectSetting('requestId', $request_id, $pid);
        REDCap::logEvent("DUSTER: getData Real Time Cohort Sync Request ID " . $request_id);
        logToStarrApi($pid, $request_id . "::status", 'sync');
        $return_obj = syncCohort($rtoslink_config);
    }
} else if ($action === 'realTimeDataRequest') {
    // real time rtos data request
    $query = isset($_GET['query']) && !empty($_GET['query']) ? json_decode($_GET['query'], true) : null;
    if ($query != null) {
        $return_obj = getData($rtoslink_config, $query);
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = $module->handleError('Duster getData: Unable to verify retrieve data', "Missing query parameter.");
    }
} else if ($action === 'asyncDataRequest') {
    // make a background data request
    $in_progress = getRequestStatus($pid);
    $module->emDebug("in_progress = " . print_r($in_progress, true));
    // request id is used to distinguish between different get data requests
    $request_id = getRequestId($pid);
    if ($in_progress['dataRequestStatus'] === 'complete' || 'no status' || 'cancel') {
        $request_id = $request_id + 1;
        //$module->setProjectSetting('requestId', $request_id, $pid);
        setRequestId($request_id, $pid);
        REDCap::logEvent("DUSTER: getData Background Request Started. Request ID " . $request_id);

        $module->emDebug(' IN ASYNC requestId=' . getRequestId($pid) . ' ' . $request_id);
        $module->emDebug('$email = ' . $_GET['email']);

        $email = (isset($_GET['email']) && !empty($_GET['email']))
            ? $_GET['email'] : null;
        $module->setProjectSetting('dataUpdateNotify', $email, $pid);
        $post_fields['redcap_url'] = APP_PATH_WEBROOT_FULL;
        $post_fields['user'] = $module->getUser()->getUserName();
        $post_fields['email'] = $email;
        $post_fields['pid'] = $pid;
        $post_fields['request_id'] = $request_id;
        $post_fields['queries'] = $rtoslink_config->getQueries();
        $duster_api_url = $module->getSystemSetting("starrapi-data-url");

        $response = $module->starrApiPostRequest($duster_api_url, 'ddp', $post_fields, true);
        possibleResponseError($duster_api_url . 'POST FIELDS: ' . print_r($post_fields, true), $response);

    }
} else if ($action === 'asyncDataLog') {
    // return logs for an on-going async request
    //$request_id = $module->getProjectSetting('requestId', $pid); // returns integer
    $request_id = getRequestId($pid);
    $module->emDebug("log request id = $request_id");
    $forms = $rtoslink_config->getQueries();

    $request_log = initRequestLog($forms);

    // now actually get the request status from the server
    $log_url = $module->getSystemSetting("starrapi-data-url")
        . "log/" . SERVER_NAME . "/$pid/$request_id?user="
        . $module->getUser()->getUserName();
    $return_logs = $module->starrApiGetRequest($log_url, 'ddp');
    possibleResponseError($log_url, $return_logs);
    $module->emDebug("asyncDataLog " . print_r($return_logs, true));
    REDCap::logEvent("DUSTER: getData Background Get Status. Request ID " . $request_id);
    $return_obj['request_status'] = $return_logs['request_status'];
    unset($return_logs['request_status']);

    // map the response messages into queries
    $num_queries = 0;
    $num_complete = 0;
    foreach($return_logs as $form_name => $form_status) {
        $request_log[$form_name]['last_message'] = $form_status['queries'][0]['message'];
        $request_log[$form_name]['last_logdttm'] = $form_status['queries'][0]['log_dttm'];
            $num_queries += $request_log[$form_name]['num_queries'];
        for ($i = 0; $i < sizeof($form_status['queries']); $i++) {
            if ($form_status['queries'][$i]['query_name'] == 'complete') {
                $request_log[$form_name]['complete'] = true;
            } else {
                if (strpos($form_status['queries'][$i]['message'], ' ended') > -1) {
                    $request_log[$form_name]['num_complete'] = $request_log[$form_name]['num_complete'] + 1;
                    // form is complete if num_queries = num_complete
                    $request_log[$form_name]['complete'] = ($request_log[$form_name]['num_complete'] ===
                        $request_log[$form_name]['num_queries']);
                    }
                }
            }
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
    $return_obj = logToStarrApi($pid, $request_id . "::status", $status);
    REDCap::logEvent("DUSTER: Request ID $request_id Get Data $status", null, null, null, null, $pid);
} else if ($action === 'emailComplete') {
    REDCap::logEvent("DUSTER: Async Get Data Complete", null, null, null, null, $pid);
    // This is a NOAUTH request from the duster server, so it can not access any part of the EM that
    // requires authentication (i.e. status)
    $email = isset($_GET['email']) && !empty($_GET['email']) ? $_GET['email'] : null;
    $request_status = $_GET['request_status'];
    $request_id = $_GET['request_id'];
    if (isset($email)) {
        $module->emDebug('email status');
        if ($request_status == 'success') {
            $message = "Duster data request $request_id for pid $pid completed successfully. ";
        } else {
            $message = "Duster data request $request_id for pid $pid completed with status $request_status. Please contact Duster support " . $this->getSystemSetting("duster-email") . ".";
        }
        // Add a link to the redcap project
        $redcap_version = explode('_',APP_PATH_WEBROOT)[1];
        $data_exports_url = APP_PATH_WEBROOT_FULL
            . 'redcap_' . $redcap_version .'DataExport/index.php?pid=' . $pid;
        $message .= "<a href=\"$data_exports_url\">View data in redcap.</a>";
        $message .= '</body></html>';
        $module->emDebug('$message = ' . $message);
        $module->emDebug('$email = ' . $email);
        $project_title = REDCap::getProjectTitle();

        if (!empty($email)) {
            $subject = "'$project_title' PID $pid Duster Request $request_status";
            $return_obj = REDCap::email($email, 'no-reply@stanford.edu', $subject , $message);
            if (!$return_obj) {
                $return_obj['status'] = 400;
                // pid is added to message as part of handleError function
                $return_obj['message'] = $module->handleError("Duster getData: Unable to send async request completion email", "Email Notification to $email Failed. SUBJECT: $subject, MESSAGE: $message");
            } else {
                $return_obj['status'] = 200;
            }
        }
    }
} else if ($action === 'complete') {
    REDCap::logEvent("DUSTER: Real Time Get Data Complete", null, null, null, null, $pid);
    $return_obj['status'] = 200;
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = $module->handleError('Duster getData: Unrecognized action', "Unrecognized action: $action");
}
echo json_encode($return_obj);
