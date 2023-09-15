<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * entrypoint to DUSTER's new project creation UI (Vue app)
 * stores POST form data in REDCap's new project creation page and URLs in local storage and redirects to Vue app
 */
$redcap_version = explode('_',APP_PATH_WEBROOT)[1];
$record_base_url = APP_PATH_WEBROOT_FULL
    . 'redcap_' . $redcap_version .'DataEntry/record_home.php?pid=' . PROJECT_ID;
$designer_url = APP_PATH_WEBROOT_FULL
    . 'redcap_' . $redcap_version .'Design/online_designer.php?pid=' . PROJECT_ID;
$data_exports_url = APP_PATH_WEBROOT_FULL
    . 'redcap_' . $redcap_version .'DataExport/index.php?pid=' . PROJECT_ID;
$project_setup_url = APP_PATH_WEBROOT_FULL
    . 'redcap_' . $redcap_version . 'ProjectSetup/index.php?pid=' . PROJECT_ID;
$data_api_url = $module->getUrl("services/getData.php?pid=" . PROJECT_ID);
$user_email = $module->getUser()->getEmail();
?>

<Script>
  localStorage.removeItem('getDataObj');
  let getDataObj = {};

  // store URL for services/checkIRB.php
  getDataObj['check_irb_url'] = "<?php echo $module->getUrl("services/checkIRB.php"); ?>" ;
  getDataObj['record_base_url'] = "<?php echo $record_base_url; ?>";
  getDataObj['designer_url'] = "<?php echo $designer_url; ?>";
  getDataObj['data_exports_url'] = "<?php echo $data_exports_url; ?>";
  getDataObj['project_setup_url'] = "<?php echo $project_setup_url; ?>";
  getDataObj['project_id'] = "<?php echo PROJECT_ID; ?>";
  getDataObj['get_data_api'] = "<?php echo $data_api_url; ?>";
  //'http://localhost/redcap_v13.4.2/ExternalModules/?prefix=duster&page=services%2FgetData?'

  getDataObj['server_name'] ="<?php echo SERVER_NAME; ?>";
  getDataObj['user_email'] = "<?php echo $user_email; ?>";

  localStorage.setItem('getDataObj', JSON.stringify(getDataObj));

  // redirect to 'new-project' Vue app for creating a new project
  // window.location = "<?php echo $module->getUrl("pages/js/duster/get-data/dist/index.html"); ?>";

</Script>

<script type="module" crossorigin src="<?php echo $module->getUrl("pages/js/duster/get-data/dist/index.js"); ?>"></script>
<link rel="stylesheet" href="<?php echo $module->getUrl("pages/js/duster/get-data/dist/assets/index-95284b24.css"); ?>">

<div id="app">

</div>
