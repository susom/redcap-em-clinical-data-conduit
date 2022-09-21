<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */

require_once $module->getModulePath() . "classes/DusterDataRequestClass.php";
require_once $module->getModulePath() . "classes/DusterDataRetrieveClass.php";

$pid = isset($_GET['pid']) && !empty($_GET['pid']) ? $_GET['pid'] : null;
$action = isset($_GET['action']) && !empty($_GET['action']) ? $_GET['action'] : null;

$duster_request = new DusterDataRequestClass($pid, $module);
if ($action === 'cohort') {
    $return_obj = $duster_request->getDusterRequestObject();
} else if ($action === 'getData') {
    $request_obj = json_decode($duster_request->getDusterRequestObject(),true);

    $duster_retrieve = new DusterDataRetrieveClass($pid, $module);
    //$data = json_decode($_GET['cohort'], true);
    //$module->emDebug("pid = ". print_r($pid, true));
    //$module->emDebug("data = ". print_r($data, true));

    $return_obj = $duster_retrieve->queryAndSave($request_obj['rp_data']);
} else {
    $return_obj['status'] = 400;
    $return_obj['message'] = "Unrecognized action: $action";
    //$return_obj = $duster_request->getDummyRequestObject();
}
echo json_encode($return_obj);
?>
