<?php
namespace Stanford\Duster;
/** @var $module Duster */

use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;
$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$rtoslink_config = new RedcapToStarrLinkConfig($pid, $module);
$return_obj = array();
// ensure the data url has a '/' at the end
$data_url = $module->getSystemSetting("starrapi-data-url")
    . ((substr($module->getSystemSetting("starrapi-data-url"), -1) === '/') ? "" : "/");
$duster_email = (!empty($module->getSystemSetting("duster-email")))
    ? $module->getSystemSetting("duster-email") : $GLOBALS['homepage_contact_email'];

function syncCohort($rtoslink_config) {
    REDCap::logEvent("DUSTER: Sync Cohort");
    $return_obj = array();
    $resp = $rtoslink_config->syncCohort();
    if ($resp) {
        $return_obj['status'] = 200;
    } else {
        $return_obj['status'] = 500;
        $return_obj['message'] = 'Unable to sync cohort';
    }
    return $return_obj;
}

/*function setRequestId($request_id, $pid) {
    global $module;
    $module->emDebug("PID $pid setRequestId =$request_id");
    //$module->db_query("SET AUTOCOMMIT=0");
    //$module->db_query("BEGIN");
    $response = $module->query('UPDATE redcap_external_module_settings set `value`=? where `project_id`=? and `key`=?',[$request_id, $pid, 'requestId']);
    //$module->setProjectSetting('requestId', $request_id, $pid);
    //$module->db_query("COMMIT");
    //$module->db_query("SET AUTOCOMMIT=1");
    $module->emDebug("PID $pid response $response");
    $module->emDebug("PID $pid setRequestId get = ". getRequestId($pid));
}*/

function setRequestId($request_id, $pid) {
    global $module;
    $module->emDebug("PID $pid setRequestId =$request_id");
    //$module->emDebug("PID $pid setRequestId get = ". getRequestId($pid));
    return dbSetProjectSetting('requestId', $request_id, $pid);
}

function resetCohortFilter($pid) {
    return dbSetProjectSetting('include-logic', '[]', $pid);
}

function setCohortFilter($min, $max, $pid) {
    global $module;
    //$module->emDebug("PID $pid setRequestId get = ". getRequestId($pid));
    $filters = [];
    $min = (isset($min) && !empty($min)) ? $min : null;
    $max = (isset($max) && !empty($max)) ? $max : null;
    if (isset($min)) {
        $filters[] ='[redcap_record_id] >= ' . $min;
    }
    if (isset($max)) {
        $filters[] ='[redcap_record_id] <= ' . $max;
    }

    $module->setProjectSetting('cohort-range', cohortRangeStr($min, $max), $pid);
    $filter_str = implode(' and ', $filters);
    $module->emDebug("PID $pid setCohortFilter =$filter_str");
    return dbSetProjectSetting('include-logic', '["'  . $filter_str . '"]', $pid);

}

function cohortRangeStr($min, $max) {
    $range = "All";
    $min = (isset($min) && !empty($min)) ? $min : null;
    $max = (isset($max) && !empty($max)) ? $max : null;

    if (isset($min)) {
        if (isset($max)) {
            $range = "$min - $max";
        } else {
            $range = ">= $min";
        }
    } else if (isset($max)) {
            $range = "<= $max";
    }
    return $range;
}

function dbSetProjectSetting($key, $value, $pid) {
    global $module;
    //$module->db_query("SET AUTOCOMMIT=0");
    //$module->db_query("BEGIN");
    $response = $module->query('UPDATE redcap_external_module_settings set `value`=? where `project_id`=? and `key`=?',[$value, $pid, $key]);
    //$module->setProjectSetting('requestId', $request_id, $pid);
    //$module->db_query("COMMIT");
    //$module->db_query("SET AUTOCOMMIT=1");
    $module->emDebug("PID $pid response $response");
    return $response;
}

function getRequestId($pid){
    global $module, $external_module_id;
    //$rid = $module->getProjectSetting('requestId', $pid);
    if (!isset($external_module_id)) {
        $external_module_result = $module->query('SELECT external_module_id FROM redcap_external_modules WHERE directory_prefix = ?', ['duster']);
        $external_module_id = $external_module_result->fetch_assoc()['external_module_id'];
    }
    $query_resp = $module->query('SELECT `value` FROM redcap_external_module_settings WHERE `external_module_id` = ? and `project_id`=? and `key`=? and `type`=?',
        [$external_module_id, $pid, 'requestId', 'integer']);
    //$module->emDebug('request_id=' . print_r($request_id->fetch_assoc(), true));
    // TODO: need to add request status to synchronized requests
    $request_id = null;
    $fetch_assoc = $query_resp->fetch_assoc();
    if (isset($fetch_assoc) && array_key_exists('value', $fetch_assoc)) {
        $request_id = $fetch_assoc['value'];
        //$module->emDebug("PID $pid request_id=$request_id");
    }
    if (!isset($request_id) ) {
        $request_id = 0;
        //$module->db_query("SET AUTOCOMMIT=0");
        //$module->db_query("BEGIN");
        $module->query('insert into redcap_external_module_settings (`project_id`,`external_module_id`,`key`,`type`,
        `value`) values (?,?,?,?,?) ',
            [$pid, $external_module_id, 'requestId', 'integer', $request_id]);
        //$module->db_query("COMMIT");
        //$module->db_query("SET AUTOCOMMIT=1");
    }
    return $request_id;
}

function requestIsDone($pid) {
    global $module;
    $request_status = getRequestStatus($pid);
    $module->emDebug("PID $pid DEBUG: requestIsDone request_status = "
        . json_encode($request_status));
    if (empty($request_status['status'])) {
        return ($request_status['dataRequestStatus'] === 'complete' ||
            $request_status['dataRequestStatus'] === 'cancel' ||
            strpos($request_status['dataRequestStatus'], 'fail') === 0 ||
            $request_status['dataRequestStatus'] === 'no status');
    }
    return false;
}

function responseHasError($response) {
    global $module;
    if (isset($response['status']) &&  $response['status'] !== 200) {
        $module->emDebug("DUSTER responseHasError: " . print_r($response, true));
        return true;
    }
    return false;
}

function logToStarrApi($pid, $query_name, $message) {
    global $module, $data_url;
    $log_url = $data_url
        . "log";
    $post_fields['user'] = $module->getUser()->getUsername();
    $post_fields['pid'] = $pid;
    $post_fields['query_name'] = $query_name;
    $post_fields['message'] = $message;
    //$module->emDebug("DEBUG: logToStarrApi query_name=$query_name; pid=$pid");
    $response = $module->starrApiPostRequest($log_url, 'ddp', $post_fields);
    if (responseHasError($response)) {
        $request_id = getRequestId($pid);
        $module->handleError('CRITICAL: Unable to log status to starr-api',"Starr-api server returned with status "
            . $response['status'] . "; error message: " . $response['message']
            . " for Request ID $request_id. Update request $request_id::status to 'fail' for PID $pid in duster_log table.");
        $response['status'] = 500;
    }
    return $response;
}

// should return the request status 'no status', 'sync','async', 'complete', 'cancel', 'fail: <message>'
function getRequestStatus($pid) {
    global $module, $data_url;
    // TODO: need to add request status to synchronized requests
    $request_id = getRequestId($pid); // returns integer
    $log_url = $data_url . "log/" . SERVER_NAME
        . "/$pid/$request_id/status?user=" . $module->getUser()->getUsername();
    $request_status = $module->starrApiGetRequest($log_url, 'ddp');
    if (responseHasError($request_status)) {
        $module->handleError('Unable to retrieve request status',"Starr-api server returned with status "
            . $request_status['status']
            . "; error message: " . $request_status['message']
            . " for Request ID $request_id.");
        $request_status['message'] = "Unable to process request due to ". $request_status['message']. ". DUSTER
        administrators have been notified of this problem.";
        // setting status to 500 to indicate to UI that this is a system error
        $request_status['status'] = 500;
    } else if (empty($request_status)) {
        $request_status['status'] = 500;
        $request_status['message'] = 'Unable to process request. No response from server. DUSTER administrators have been notified of this problem.';
        $module->handleError('Unable to retrieve request status',"Starr-api server returned a request status of 'null' for Request ID $request_id.   Please check if Starr-api server online.");
    } else {
        $request_status['cohortRange'] = $module->getProjectSetting('cohort-range', $pid);
    }
    $module->emDebug("get request status log_url = $log_url");
    $module->emDebug("PID $pid DEBUG getRequestStatus request_id = $request_id; request_status = " . json_encode($request_status));
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
        $request_log[$form_name]['fail'] = false;
    }
    return $request_log;
}

function realTimeDataRequest($rtoslink_config, $query) {
    global $module, $pid;
    REDCap::logEvent("DUSTER: Get Data for " . $query['query_name']);
    $return_obj = array();
    if ($query != null) {
        //$resp should be '1'
        $resp = $rtoslink_config->updateData($query['query_name']);
        $query_label = $query['query_label'];
        $module->emDebug("PID $pid DEBUG: getData query= " . $query['query_name']
            . "; resp = $resp");
        $return_obj['query_name'] = $query['query_name'];
        //$resp should = 1 if successful
        if ($resp) {
            $return_obj['message'] = "Update for " . toQueryLabel($query_label) . " is complete.";
        } else {
            $request_id = getRequestId($pid);
            $module->handleError('DUSTER getData: Real Time', "Request ID $request_id Get Data Error: Unable to update "
                . $query['query_name'] . ".  RedcapToStarrLink response: " . print_r($resp, true));
            $return_obj['message'] = 'Get Data Error: Unable to update ' . toQueryLabel($query_label);
        }
        // set status to 200 even in error case because we don't handle this as an error in the UI
        $return_obj['status'] = 200;

    } else {
        $return_obj['status'] = 500;
        $return_obj['message'] = $module->handleError('DUSTER getData: Real Time',
            "Get Data Error: No query.");
    }
    return $return_obj;
}

function toQueryLabel($queryLabel) {
    $label = explode('_', $queryLabel);
    array_shift($label);
    return ucwords(implode(' ', $label));
}

if ($action === 'productionStatus') {
    // check that redcap project is in production status
    $result = $module->query(
        "select `status` from redcap_projects where `project_id`=?",
        [$pid]);
    if ($result->num_rows > 0) {
        $return_obj['status'] = 200;
        $return_obj['production_status'] = json_decode($result->fetch_assoc()['status'], true);
    } else {
        $return_obj['status'] = 500;
        $return_obj['message'] = $module->handleError('DUSTER getData: Unable to verify project status', 'Unable to verify production status.');
    }
} else if ($action === 'cohort') {
    // populate the cohort for get-data
    REDCap::logEvent("DUSTER: Get Data loaded");
    $duster_config = new DusterConfigClass($pid, $module);
    $return_obj = $duster_config->getDusterRequestObject();
    if (isset($return_obj['status']) && $return_obj['status'] != 200) {
        $msg = $module->handleError('DUSTER getData: Unable to get cohort', $return_obj['message']);
        $return_obj['message'] = $msg;
    } else {
        $return_obj["queries"] = $rtoslink_config->getQueries();
        $module->emDebug("PID $pid DEBUG: 'cohort' rtos queries: " . print_r($return_obj["queries"], true));
        $num_queries = 0;
        foreach ($return_obj["queries"] as $query) {
            $num_queries += count($query);
        }
        if ($num_queries) {
            $return_obj['num_queries'] = $num_queries;
            $return_obj['status'] = 200;
        } else {
            $return_obj['status'] = 400;
            $return_obj['message'] = $module->handleError('DUSTER getData: No configured queries', 'This project does not have any configured queries.');
        }
    }
} else if ($action === 'dataRequestStatus') {
    // check if there's an ongoing data request
    $return_obj = getRequestStatus($pid);
} else if ($action === 'realTimeSyncCohort') {
    // real time rtos link cohort sync
    // request id is used to distinguish between different get data requests
    $request_id = getRequestId($pid);
    if (requestIsDone($pid)) {
        $request_id = $request_id + 1;
        setCohortFilter($_GET['min'], $_GET['max'], $pid);
        $cohort_str = cohortRangeStr($_GET['min'], $_GET['max']);
        setRequestId($request_id, $pid);
        //$module->setProjectSetting('requestId', $request_id, $pid);
        REDCap::logEvent("DUSTER: getData Real Time Cohort Sync Request ID "
            . "$request_id for $cohort_str");
        $return_obj = logToStarrApi($pid, $request_id . "::status", 'sync');
        if (!responseHasError($return_obj)) {
            // response should be '1'
            logToStarrApi($pid, $request_id . "::cohort", $module->getProjectSetting('cohort-range', $pid));
            $return_obj = syncCohort($rtoslink_config);
            $module->emDebug("PID $pid DEBUG: 'realTimeSyncCohort' $cohort_str response " . print_r($return_obj, true));
            if (responseHasError($return_obj)) {
                logToStarrApi($pid, $request_id . "::status", 'fail: ' . $return_obj['message']);
                $module->handleError('DUSTER getData: Real time cohort sync',
                    'Real time Error: ' . $return_obj['message'] . "<br>Cohort: $cohort_str");
            }
        }
    }
    resetCohortFilter($pid);
} else if ($action === 'realTimeDataRequest') {
    // real time rtos data request
    $query = isset($_GET['query']) && !empty($_GET['query']) ? json_decode($_GET['query'], true) : null;
    if ($query != null) {
        $return_obj = realTimeDataRequest($rtoslink_config, $query);
    } else {
        $return_obj['status'] = 500;
        $return_obj['message'] = $module->handleError('DUSTER getData: Unable to verify retrieve data', "Missing query parameter.");
    }
} else if ($action === 'asyncDataRequest') {
    // make a background data request
    $request_id = getRequestId($pid);
    if (requestIsDone($pid)) {
        $request_id = $request_id + 1;
        //$module->setProjectSetting('requestId', $request_id, $pid);
        setRequestId($request_id, $pid);
        $return_obj = setCohortFilter($_GET['min'], $_GET['max'], $pid);
        $cohort_str = cohortRangeStr($_GET['min'], $_GET['max']);

        REDCap::logEvent("DUSTER: getData Background Request Started for $cohort_str. Request ID " . $request_id);

        // email is required in UI so this check shouldn't be necessary
        $email = (isset($_GET['email']) && !empty($_GET['email']))
            ? $_GET['email'] : null;
        $module->setProjectSetting('dataUpdateNotify', $email, $pid);
        $post_fields['redcap_url'] = $module->getRedcapUrl();
        $post_fields['user'] = $module->getUser()->getUsername();
        $post_fields['email'] = $email;
        $post_fields['pid'] = $pid;
        $post_fields['request_id'] = $request_id;
        $post_fields['cohort_range'] = $module->getProjectSetting('cohort-range', $pid);
        $post_fields['queries'] = $rtoslink_config->getQueries();
        $return_obj = $module->starrApiPostRequest($data_url, 'ddp', $post_fields);
        $module->emDebug(' IN ASYNC requestId=' . getRequestId($pid) . ' ' . $request_id . ' return=' .
            print_r($return_obj, true));

        if (responseHasError($return_obj)) {
            $return_obj['status'] = 500;
            $module->emError("PID $pid ERROR: asyncDataRequest unable to post async requests.");
            logToStarrApi($pid, $request_id . "::status", 'fail');
        } else {
            $redcap_version = explode('_',APP_PATH_WEBROOT)[1];
            $get_data_url = $module->getRedcapUrl()
                . 'redcap_' . $redcap_version
                . 'ExternalModules/?prefix=duster&page=pages%2FpopulateData&pid='
                . $pid;
            $project_title = $module->getProject($pid)->getTitle();
            $email_status = REDCap::email($email, $duster_email, "Redcap Project \"$project_title\" PID $pid DUSTER Request submitted",
                "DUSTER data retrieval request $request_id for pid $pid has been submitted for $cohort_str.  An email will be sent to you when retrieval is complete. <br><a href=\"$get_data_url\">View request status in redcap.</a>");
          }
        // post errors logged in starrApiPostRequest
    }
} else if ($action === 'asyncDataLog') {
    // return logs for an on-going async request
    //$request_id = $module->getProjectSetting('requestId', $pid); // returns integer
    $request_id = getRequestId($pid);
    $module->emDebug("PID $pid DEBUG: asyncDataLog request id = $request_id");
    $forms = $rtoslink_config->getQueries();
    $request_log = initRequestLog($forms);

    // now actually get the request status from the server
    $log_url = $data_url . "log/"
        . SERVER_NAME . "/$pid/$request_id?user="
        . $module->getUser()->getUsername();
    $logs = $module->starrApiGetRequest($log_url, 'ddp');
    //REDCap::logEvent("DUSTER: getData Background Get Status. Request ID " . $request_id);

    //if there was an error from the get request, just return the contents of the get request
    if (responseHasError($logs)) {
        $return_obj = $logs;
        $return_obj['status'] = 500;
        $module->emError("PID $pid ERROR: asyncDataLog problem retrieving status from server.");
        logToStarrApi($pid, $request_id . "::status", 'fail');
    } else {
        $return_obj['request_status'] = $logs['request_status'];
        unset($logs['request_status']);

        // map the response messages into queries
        $num_queries = 0;
        $num_complete = 0;
        foreach ($logs as $form_name => $form_status) {
            $request_log[$form_name]['last_message'] = $form_status['queries'][0]['message'];
            $request_log[$form_name]['last_logdttm'] = $form_status['queries'][0]['log_dttm'];
            $num_queries += $request_log[$form_name]['num_queries'];
            $request_log[$form_name]['fail'] = (strpos($request_log[$form_name]['last_message'], 'fail') === 0);
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
        $return_obj['cohortRange'] = urlencode($module->getProjectSetting('cohort-range', $pid));
    }
    $module->emDebug("PID $pid DEBUG: asyncDataLog return_obj = ". print_r($return_obj, true));
    //$return_obj['status'] = $return_obj['status'];
} else if ($action === 'logStatus') {
    // save data request status to duster log table
    // if in sync mode, use to log complete to the duster log table
    // logStatus with status::cancel will cancel async data request
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $status = $_GET['status'];
        $request_id = getRequestId($pid);
        $return_obj = logToStarrApi($pid, $request_id . "::status", $status);
        REDCap::logEvent("DUSTER: Request ID $request_id Get Data $status", null, null, null, null, $pid);
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = $module->handleError('DUSTER logStatus: status is not set', 'No status set in logStatus.');
    }
} else if ($action === 'emailComplete') {
    $cohort_str = ($module->getProjectSetting('cohort-range', $pid) == 'All')
        ? 'all records'
        : 'records ' . $module->getProjectSetting('cohort-range', $pid);
    // called by starr api server to send email at the end of async request
    REDCap::logEvent("DUSTER: Async Get Data Complete for $cohort_str", null, null, null, null, $pid);
    $return_obj = resetCohortFilter($pid);
    // This is a NOAUTH request from the duster server, so it can not access any part of the EM that
    // requires authentication (i.e. status)
    $email = isset($_GET['email']) && !empty($_GET['email']) ? $_GET['email'] : null;
    $duster_email = $module->getSystemSetting("duster-email");
    list($request_status, $failed_instruments) = explode(":", $_GET['request_status'] ?? []);
    //$module->emDebug("email status " . $_GET['request_status']);
    $request_id = $_GET['request_id'] ?? 'unknown';
    if ($email) {
        if ($request_status == 'success') {
            $message = "DUSTER data retrieval request $request_id for pid $pid $cohort_str completed successfully.<br>";
        } else {
            $message = "DUSTER data request $request_id for pid $pid $cohort_str completed with status " .
                $request_status . ".<br>";
            if ($request_status === 'fail') {
                $admin_subject = "PID $pid DUSTER Async Request $request_status";
                $admin_message = "Request Id $request_id async queries failed for $cohort_str. ";
                if (isset($failed_instruments)) {
                    $failed_instruments = ucwords(preg_replace('/_|(cw\d+_)/', ' ', $failed_instruments));
                    //$module->emDebug("failed instruments: $failed_instruments");
                    $message .= "The following instrument queries were unable to complete: $failed_instruments"
                        . ".<br>An email regarding this issue has been sent to the DUSTER team. Please contact $duster_email for more information.<br>";
                    $admin_message .= 'Failed instruments: ' . $failed_instruments . '. Please review duster logs.';
                }
                // send an email to duster admin about async failures
                if (!empty($duster_email)) {
                    //$module->emDebug("homepage_contact_email " . $GLOBALS['homepage_contact_email']);
                    $email_status = REDCap::email($duster_email, $GLOBALS['homepage_contact_email'], $admin_subject,
                        $admin_message);
                }
            }
        }
        // Add a link to the redcap project
        $redcap_version = explode('_', APP_PATH_WEBROOT)[1];
        $data_exports_url = $module->getRedcapUrl()
            . 'redcap_' . $redcap_version . 'DataExport/index.php?pid=' . $pid;
        $message .= "<br><a href=\"$data_exports_url\">View data in redcap.</a>";
        $message .= '</body></html>';
        $module->emDebug("PID $pid message = $message");
        $module->emDebug("PID $pid email = $email");
        $project_title = $module->getProject($pid)->getTitle();
        $module->emDebug("PID $pid project_title = $project_title");

        if (!empty($email)) {
            $subject = "Redcap Project \"$project_title \" PID $pid DUSTER Request $request_status";
            $email_status = REDCap::email($email, $duster_email, $subject, $message);
            if (!$email_status) {
                $return_obj['status'] = 400;
                // pid is added to message as part of handleError function
                $return_obj['message'] = $module->handleError("DUSTER getData: Unable to send async request completion email", "Email Notification to $email Failed. SUBJECT: $subject, MESSAGE: $message");
            } else {
                $return_obj['status'] = 200;
            }
        }
    } else {
        $return_obj['status'] = 400;
        $return_obj['message'] = 'Email is not set';
        $module->emError("PID $pid email parameter is not set.");
    }
    $module->emDebug("PID $pid end emailComplete");
} else if ($action === 'error') {
    $return_obj = resetCohortFilter($pid);
    // log to redcap log and send error email
    REDCap::logEvent("DUSTER: Get Data Error", null, null, null, null, $pid);
    $message = isset($_GET['message']) && !empty($_GET['message']) ? $_GET['message'] : null;
    $request_id = getRequestId($pid);
    $module->handleError("PID $pid Request ID $request_id Uncaught Error", $message);
} else if ($action === 'complete') {
    $cohort_str = ($module->getProjectSetting('cohort-range', $pid) == 'All')
        ? 'all records'
        : 'records ' . $module->getProjectSetting('cohort-range', $pid) ;    // log complete to redcap log
    REDCap::logEvent("DUSTER: Real Time Get Data for $cohort_str Complete", null, null, null, null, $pid);
    $return_obj = resetCohortFilter($pid);
    $return_obj['status'] = 200;
} else {
    $return_obj['status'] = 500;
    $request_id = getRequestId($pid);
    $return_obj['message'] = $module->handleError("PID $pid Request ID $request_id DUSTER getData: Unrecognized action",
        "Unrecognized action: $action");
}
echo json_encode($return_obj);
