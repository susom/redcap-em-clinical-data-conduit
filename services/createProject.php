<?php
namespace Stanford\Duster;
/** @var $module Duster */

use RedCapDB;

if(!isset($_POST['odm']) | !isset($_POST['app_title']) | !isset($_POST['purpose'])) {
    // TODO exit/return since we cannot create the project as intended without these parameters
}
/*
$project_title = $purpose = $purpose_other = $project_notes = $is_longitudinal = $surveys_enabled = $record_autonumbering_enabled = "";
$data_arr = array(
    "project_title" => "",
    "purpose" => "",
    "purpose_other" => "",
    "project_notes" => "",
    "is_longitudinal" => "",
    "surveys_enabled" => "",
    "record_autonumbering_enabled" => ""
);

foreach($data_arr as $key => &$value) {
    if(isset($_POST[$key])) {
        $value = $_POST[$key];
    }
}
unset($value);
$module->emDebug($data_arr);
echo $data_arr;
$odm = $_POST['odm'];
unset($_POST['odm']);

$project_title = $_POST['app_title'];
unset($_POST['app_title']);
$purpose = $_POST['purpose'];
unset($_POST['purpose']);
*/

$odm = $_POST['odm'];

$data_arr = array(
    'project_title' => $_POST['app_title'],
    'purpose' => $_POST['purpose']
);

if(isset($_POST['purpose_other'])) {
    $data_arr['purpose_other'] = $_POST['purpose_other'];
}
if(isset($_POST['project_notes'])) {
    $data_arr['project_notes'] = $_POST['project_notes'];
}

$data_json = json_encode(array($data_arr));

// create a super token if needed
// if a super token was created, then delete it after
$db = new RedCapDB();
$delete_token = false;
$super_token = $db->getUserSuperToken(USERID);
if(!$super_token) {
    // Create a temporary token
    if($db->setAPITokenSuper(USERID)) {
        $module->emDebug("Created token successfully");
        $super_token = $db->getUserSuperToken(USERID);
        $delete_token = true;
        // Remember to delete the temporary token
       // register_shutdown_function(array($this, "deleteTempSuperToken"));
    } else {
        $module->emError("Failed in creating super token");
        // TODO exit/return since we cannot create a project without a super token
    }
}

// call REDCap API to create project
$fields = array(
	'token'   => $super_token,
	'content' => 'project',
	'format'  => 'json',
	'data'    => $data_json,
	'odm'     => $odm
);

$ch = curl_init();
$api_url = APP_PATH_WEBROOT_FULL . "api/";
$module->emDebug("API URL is " . $api_url . "\n");
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields, '', '&'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // Set to TRUE for production use TODO ??
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);

$project_token = curl_exec($ch);
$module->emDebug($project_token);
//echo $output;
curl_close($ch);


// use the user's token for the newly created project to identify the pid
$project_id = $module->getUserProjectFromToken($project_token);
$module->emDebug($project_id);

// add project info via SQL
// since not all project info could be added via the REDCap create project call with ODM XML due to API limitations
// TODO consider using createQuery() instead
$sql = "
        UPDATE redcap_projects
            SET
                purpose = '{$_POST['purpose']}',
                purpose_other = " .  checkNull($_POST['purpose_other']) . ",
		        project_pi_firstname = " . ((!isset($_POST['project_pi_firstname']) || $_POST['project_pi_firstname'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_firstname'])."'") . ",
                project_pi_mi = " . ((!isset($_POST['project_pi_mi']) || $_POST['project_pi_mi'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_mi'])."'") . ",
                project_pi_lastname = " . ((!isset($_POST['project_pi_lastname']) || $_POST['project_pi_lastname'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_lastname'])."'") . ",
                project_pi_email = " . ((!isset($_POST['project_pi_email']) || $_POST['project_pi_email'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_email'])."'") . ",
                project_pi_alias = " . ((!isset($_POST['project_pi_alias']) || $_POST['project_pi_alias'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_alias'])."'") . ",
                project_pi_username = " . ((!isset($_POST['project_pi_username']) || $_POST['project_pi_username'] == "") ? "NULL" : "'".db_escape($_POST['project_pi_username'])."'") . ",
                project_irb_number = " . ((!isset($_POST['project_irb_number']) || $_POST['project_irb_number'] == "") ? "NULL" : "'".db_escape($_POST['project_irb_number'])."'") . ",
		        project_grant_number = " . ((!isset($_POST['project_grant_number']) || $_POST['project_grant_number'] == "") ? "NULL" : "'".db_escape($_POST['project_grant_number'])."'") . ",
                project_note= " . checkNull(trim($_POST['project_note'])) . "
        WHERE project_id = {$project_id}
        ";
$q = db_query($sql);
// TODO consider revising error handling here when using createQuery() above
if (!$q || db_affected_rows() != 1) {
    print db_error();
    queryFail($sql);
}

// enable DUSTER EM
// $module->enableDusterOnProject($project_id);
$module->enableModule($project_id, NULL);

// delete the project super token if needed
if($delete_token) {
    $db->deleteApiTokenSuper(USERID);
}

echo APP_PATH_WEBROOT_FULL . substr(APP_PATH_WEBROOT, 1) . "ProjectSetup/index.php?pid=$project_id&msg=newproject";
?>
