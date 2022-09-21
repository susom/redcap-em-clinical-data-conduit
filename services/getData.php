<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */

require_once $module->getModulePath() . "classes/DusterDataRequestClass.php";
require_once $module->getModulePath() . "classes/DusterDataRetrieveClass.php";

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

if ($action === 'cohort') {
    $duster_request = new DusterDataRequestClass($pid, $module);
    $return_obj = $duster_request->getDusterRequestObject();
} else if ($action === 'getData') {
    $request_obj = json_decode($_POST['data'], true);
    $duster_retrieve = new DusterDataRetrieveClass($pid, $module);
    //$module->emDebug("pid = ". print_r($pid, true));
    //$module->emDebug("data = ". print_r($request_obj, true));
    $return_obj = $duster_retrieve->queryAndSave($request_obj);
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
    //$return_obj = $duster_request->getDummyRequestObject();
}
echo json_encode($return_obj);
?>
