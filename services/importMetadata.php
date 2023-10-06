<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster $module */

use RedCapDB;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";
require_once $module->getModulePath() . "classes/RedcapToStarrLinkConfig.php";

$json = htmlentities($_POST['data'], ENT_QUOTES);
// $module->emLog($json);
$data = json_decode($json, true);
// $module->emLog($data);
$project_id = intval(PROJECT_ID);

$duster_config = new DusterConfigClass(PROJECT_ID, $module);
$duster_config->setDusterConfig($data['config']);

// create an api token, then delete it after
$db = new RedCapDB();
$db->setAPIToken(USERID, PROJECT_ID);
$user_token = $db->getAPIToken(USERID, PROJECT_ID);
if (!$user_token) {
    $module->emError("No user token");
    // TODO exit/return since we cannot create a project without a super token
}
$module->emDebug(json_encode($duster_config->getRedcapMetadata()));
// call REDCap API to import project metadata
$fields = array(
    'token'   => $user_token,
    'content' => 'metadata',
    'format'  => 'json',
    'data'     => json_encode($duster_config->getRedcapMetadata()),
    'returnFormat' => 'json'
);

$ch = curl_init();
$api_url = APP_PATH_WEBROOT_FULL . "api/";
// for testing in local set up in docker
//$api_url= "http://localhost:80/redcap/api/";
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

$result = curl_exec($ch);
$module->emDebug("CURL RETURN: ". $result);
$module->emDebug("CURL ERROR: ".curl_error($ch));
curl_close($ch);

// set the instrument names correctly since there isn't an api to do this
$forms = $duster_config->getForms();

foreach($forms as $form) {
    $module->emDebug($form);
    $updateFormName = $module->query(
        "UPDATE redcap_metadata set form_menu_description=? where project_id=? and form_name=? and field_order=1",
        [
            $form['form_label'],
            $project_id,
            $form['form_name']
        ]
    );
    if (!$updateFormName) {
        //something bad happened
    }
}


$db->deleteAPIToken(USERID, PROJECT_ID);

/* send POST request to DUSTER's config route in STARR-API */
$data_arr['redcap_server_name'] = SERVER_NAME;
$data_arr['project_title'] = $data['app_title'];
$data_arr['project_irb_number'] = $data['project_irb_number'];
$data_arr['project_pi_name'] = $data['project_pi_firstname'] . ' ' . $data['project_pi_lastname'];

// Retrieve the data URL that is saved in the config file
$config_url = $module->getSystemSetting("starrapi-config-url");
// set up the POST body
$config_data = array(
    'redcap_project_id' => $project_id,
    'config' => $duster_config->getDusterConfig(),
    'linkinfo' => $data_arr
);
$result = $module->starrApiPostRequest($config_url, 'ddp', $config_data);

// TODO: enable redcap to starr link and configure it
/*if ($result['success'] && $result['rcToStarrLinkConfig']) {
    $em_config = json_decode($result, true);
    $rctostarr_config = new RedcapToStarrLinkConfig($project_id, $module);
    $rctostarr_config->enableRedcapToStarrLink();
    $rctostarr_config->configureRedcapToStarrLink($em_config);
}*/
echo APP_PATH_WEBROOT_FULL . substr(APP_PATH_WEBROOT, 1) . "ProjectSetup/index.php?pid=$project_id&msg=newproject&dustercomplete=true";
?>
