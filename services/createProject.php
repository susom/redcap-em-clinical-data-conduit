<?php
namespace Stanford\Duster;
/** @var $module Duster */

use RedCapDB;
use Throwable;
use Exception;

require_once $module->getModulePath() . "classes/OdmXmlString.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

/**
 * service page to create REDCap via DUSTER's new project UI
 */

/**
 * avoiding false-positive Psalm TaintedSSRF on $_POST['data']
 * @psalm-taint-escape ssrf
 */

/* get JSON from POST request */
$data = json_decode($_POST['data'], true);
$module->emLog($data);

/* construct the ODM XML string */
try {
  $odm = new OdmXmlString($data['app_title'], $data['purpose'], $data['purpose_other'], $data['project_note']);
  $config = $data['config'];
  // Researcher-Provided Information
  if (array_key_exists("rp_info", $config)) {
    $rp_form_name = "researcher_provided_information";
    $rp_form_label = "Researcher-Provided Information";
    $odm->addForm($rp_form_name, $rp_form_label);
    // add field for REDCap Record ID
    $odm->addFields($rp_form_name, null, null, "", array(array("redcap_field_name" => "redcap_record_id", "label" => "REDCap Record ID", "format" => "text")));
    // add fields for identifiers
    $odm->addFields($rp_form_name, null, null, "Identifiers", $config["rp_info"]["rp_identifiers"]);
    // add fields for dates
    $dates_arr = [];
    foreach ($config["rp_info"]["rp_dates"] as $date) {
      $dates_arr[] = $date;
    }
    $odm->addFields($rp_form_name, null, null, "Dates", $dates_arr);

  } else {
    throw new Exception ("DUSTER configuration requires Researcher-Provided values");
  }

  // Demographics
  if (array_key_exists("demographics", $config)) {
    $demo_form_name = "demographics";
    $demo_form_label = "Demographics";
    $odm->addForm($demo_form_name, $demo_form_label);
    $odm->addFields($demo_form_name, null, null, "", $config["demographics"]);
  }

  // Clinical Windows
  if(array_key_exists("collection_windows", $config)) {
    foreach($config["collection_windows"] as $collection_window) {
      // add form
      $odm->addForm($collection_window["form_name"], $collection_window["label"]);
      // add timing fields with its own section header
      $timing_fields_arr = [$collection_window["timing"]["start"], $collection_window["timing"]["end"]];
      $odm->addFields($collection_window["form_name"], null, null, "Timing", $timing_fields_arr);
      // add labs with its own section header
      $odm->addFields($collection_window["form_name"], null, null, "Labs", $collection_window["data"]["labs"]);
      // add vitals with its own section header
      $odm->addFields($collection_window["form_name"], null, null, "Vitals", $collection_window["data"]["vitals"]);
      // add outcomes with its own section header
      $odm->addFields($collection_window["form_name"], null, null, "Outcomes", $collection_window["data"]["outcomes"]);

      // add each score with a section header
      foreach($collection_window["data"]["scores"] as $score) {
        $score_arr = [];
        // add each subscore for score
        foreach($score["subscores"] as $subscore) {
          // add each clinical variable for subscore
          foreach($subscore["dependencies"] as $clinical_var) {
            $score_arr[] = $clinical_var;
          }
          unset($subscore["dependencies"]);
          $score_arr[] = $subscore;
        }
        unset($score["subscores"]);
        $score_arr[] = $score;
        $odm->addFields($collection_window["form_name"], null, null, $score["label"], $score_arr);
      }
    }
  }

  $odm_str = $odm->getOdmXmlString();
  $module->emLog($odm_str);
} catch (Throwable $ex) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to create an ODM XML string.", $ex );
  print "Error: Failed to create project. " . $msg;
  exit();
}

$data_arr = array(
  'project_title' => $data['app_title'],
  'purpose' => $data['purpose']
);

if(array_key_exists("purpose_other", $data)) {
  $data_arr['purpose_other'] = $data['purpose_other'];
}
if(array_key_exists("purpose_other", $data)) {
  $data_arr['project_notes'] = $data['project_notes'];
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
    $msg = $module->handleError('DUSTER Error: Project Create', "Failed to create a REDCap SUPER API Token for user " . USERID);
    print "Error: Failed to create project. " . $msg;
    exit();
  }
}

// call REDCap API to create project
$fields = array(
  'token'   => $super_token,
  'content' => 'project',
  'format'  => 'json',
  'data'    => $data_json,
  'odm'     => $odm_str
);

$ch = curl_init();
$api_url = APP_PATH_WEBROOT_FULL . "api/";
// $api_url= "http://localhost:80/redcap/api/";

$module->emDebug("API URL is " . $api_url . "\n");
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields, '', '&'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);

$project_token = curl_exec($ch);
$module->emDebug($project_token);
if (empty($project_token)) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to retrieve project token." );
  print "Error: Failed to create project. " . $msg;
  exit();
}
//echo $output;
curl_close($ch);

// use the user's token for the newly created project to identify the pid
try {
  $project_id = $module->getUserProjectFromToken($project_token);
  $module->emDebug($project_id);
} catch (Throwable $ex) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to retrieve user token/project id.", $ex);
  print "Error: Failed to create project. " . $msg;
  exit();
}

// add project info via SQL
// since not all project info could be added via the REDCap create project call with ODM XML due to API limitations
$project_info_sql_result = $module->query(
  '
    UPDATE redcap_projects
      SET
        purpose = ?,
        purpose_other = ?,
        project_pi_firstname = ?,
        project_pi_mi = ?,
        project_pi_lastname = ?,
        project_pi_email = ?,
        project_pi_alias = ?,
        project_pi_username = ?,
        project_irb_number = ?,
        project_grant_number = ?,
        project_note = ?
    WHERE project_id = ?
  ',
  [
    $data['purpose'], // purpose
    trim($data['purpose_other']), // purpose_other
    !isset($data['project_pi_firstname']) || $data['project_pi_firstname'] == "" ? NULL : db_escape($data['project_pi_firstname']), // project_pi_firstname
    !isset($data['project_pi_mi']) || $data['project_pi_mi'] == "" ? NULL : db_escape($data['project_pi_mi']), // project_pi_mi
    !isset($data['project_pi_lastname']) || $data['project_pi_lastname'] == "" ? NULL : db_escape($data['project_pi_lastname']), // project_pi_lastname
    !isset($data['project_pi_email']) || $data['project_pi_email'] == "" ? NULL : db_escape($data['project_pi_email']), // project_pi_email
    !isset($data['project_pi_alias']) || $data['project_pi_alias'] == "" ? NULL : db_escape($data['project_pi_alias']), // project_pi_alias
    !isset($data['project_pi_username']) || $data['project_pi_username'] == "" ? NULL : db_escape($data['project_pi_username']), // project_pi_username
    !isset($data['project_irb_number']) || $data['project_irb_number'] == "" ? NULL : db_escape($data['project_irb_number']), // project_irb_number
    !isset($data['project_grant_number']) || $data['project_grant_number'] == "" ? NULL : db_escape($data['project_grant_number']), // project_grant_number
    trim($data['project_note']), // project_note
    $project_id // project_id
  ]
);
$module->emDebug($project_info_sql_result);
if(!$project_info_sql_result) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to add project info in services/createProject.php. Db insert failed with data=".print_r($data, true));
  print "Error: A REDCap project was created (pid $project_id), but DUSTER failed to add project info to it. " . $msg;
  exit();
}

$data_arr['redcap_server_name'] = SERVER_NAME;
$data_arr['project_irb_number'] = $data['project_irb_number'];
$data_arr['project_pi_name'] = $data['project_pi_firstname'] . ' ' . $data['project_pi_lastname'];

// put DUSTER into project-level context of the newly created project
// for sake of non-admin user permissions
$_GET['pid'] = $project_id;

// enable DUSTER EM on the newly created project
$external_module_id = $module->query('SELECT external_module_id FROM redcap_external_modules WHERE directory_prefix = ?', ['duster']);
$em_module_sql_result = $module->query('INSERT INTO `redcap_external_module_settings`(`external_module_id`, `project_id`, `key`, `type`, `value`) VALUES (?, ?, ?, ?, ?)',
  [$external_module_id->fetch_assoc()['external_module_id'], $project_id, 'enabled', 'boolean', 'true']);
if (!$em_module_sql_result) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to enable DUSTER EM on new project $project_id. Db insert failed with following values: external_module_id" .  $external_module_id->fetch_assoc()['external_module_id'] . ", project_id: $project_id, key: enabled, type: boolean, value: true");
  print "Error: A new REDCap project was created (pid $project_id), but the DUSTER EM failed to enable itself on the project. " . $msg;
  exit();
}

// delete the project super token if needed
if($delete_token) {
  $db->deleteApiTokenSuper(USERID);
}

/* send POST request to DUSTER's config route in STARR-API */

// Retrieve the data URL that is saved in the config file
$config_url = $module->getSystemSetting("starrapi-config-url");

// Retrieve the Vertx Token
$token = false;
try {
  $tokenMgnt = \ExternalModules\ExternalModules::getModuleInstance('vertx_token_manager');
  $token = $tokenMgnt->findValidToken('ddp');
} catch (Throwable $ex) {
  $msg = $module->handleError('DUSTER Error: Project Create',  "Failed to find a valid vertx token for service ddp in createProject.", $ex);
  print "Error: A new REDCap project was created (pid $project_id), but DUSTER's data queries for this project failed to set up. " . $msg;
  exit();
}

// set up the headers
$headers = array(
  // "Accept: application/json",
  "Content-Type: application/json",
  "Authorization: Bearer $token"
);

/**
 * @var string $config_data
 * @psalm-ignore-var
 */
// set up the POST body as a JSON-encoded string
$config_data = json_encode(array(
  'redcap_project_id' => $project_id,
  'redcap_user' => $module->getUser()->getUserName(),
  'config' => $data['config'],
  'linkinfo' => $data_arr
));

// Create a new cURL resource
$ch = curl_init($config_url);

// Attach JSON-encoded string to the POST fields
curl_setopt($ch, CURLOPT_POSTFIELDS, $config_data);

// Set the content type to application/json
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Return response instead of outputting
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the POST request
$result = curl_exec($ch);
$module->emDebug('starr-api result: '. $result);

// Close cURL resource
curl_close($ch);

$module->emDebug('Setting up REDCap to STARR Link');

$em_config = json_decode($result, true);
// $module->emDebug('em_config: '. $em_config);
$module->emDebug('em_config: '. $result);

if ($em_config['success'] && !empty($em_config['rcToStarrLinkConfig'])) {
  $rctostarr_config = new RedcapToStarrLinkConfig($project_id, $module);
  $rctostarr_config->enableRedcapToStarrLink();
  $rctostarr_config->configureRedcapToStarrLink($em_config);

  $module->emDebug(APP_PATH_WEBROOT_FULL . substr(APP_PATH_WEBROOT, 1) . "ProjectSetup/index.php?pid=$project_id&msg=newproject");
  echo APP_PATH_WEBROOT_FULL . substr(APP_PATH_WEBROOT, 1) . "ProjectSetup/index.php?pid=$project_id&msg=newproject";
} else {
  $msg = $module->handleError("Duster Error: Project Create",  "Could not retrieve RtoS configuration for project_id $project_id. Error:" . $em_config['error']);

  print "Error: A new REDCap project was created (pid $project_id), but DUSTER's data queries for this project failed to set up. " . $msg;
}
