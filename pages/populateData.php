<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * entrypoint to DUSTER's new project creation UI (Vue app)
 * stores POST form data in REDCap's new project creation page and URLs in local storage and redirects to Vue app
 */
$redcap_version = explode('_',APP_PATH_WEBROOT)[1];
?>

<Script>
  localStorage.removeItem('getDataObj');
  let getDataObj = {};

  // store URL for services/checkIRB.php
  getDataObj['check_irb_url'] = "<?php echo $module->getUrl("services/checkIRB.php"); ?>";
  getDataObj['compliance_emails_url'] = "<?php echo $module->getUrl("services/handleCompliance.php?pid=" . PROJECT_ID);
  ?>";
  getDataObj['redcap_csrf_token'] = "<?php echo $module->getCSRFToken(); ?>";
  getDataObj['record_base_url'] = "<?php echo APP_PATH_WEBROOT_FULL
      . 'redcap_' . $redcap_version .'DataEntry/record_home.php?pid=' . PROJECT_ID; ?>";
  getDataObj['designer_url'] = "<?php echo APP_PATH_WEBROOT_FULL
      . 'redcap_' . $redcap_version .'Design/online_designer.php?pid=' . PROJECT_ID; ?>";
  getDataObj['data_exports_url'] = "<?php echo APP_PATH_WEBROOT_FULL
      . 'redcap_' . $redcap_version .'DataExport/index.php?pid=' . PROJECT_ID; ?>";
  getDataObj['project_setup_url'] = "<?php echo APP_PATH_WEBROOT_FULL
      . 'redcap_' . $redcap_version . 'ProjectSetup/index.php?pid=' . PROJECT_ID; ?>";
  getDataObj['project_id'] = "<?php echo PROJECT_ID; ?>";
  getDataObj['get_data_api'] = "<?php echo $module->getUrl("services/getData.php?pid=" . PROJECT_ID); ?>";
  //'http://localhost/redcap_v13.4.2/ExternalModules/?prefix=duster&page=services%2FgetData?'

  getDataObj['server_name'] ="<?php echo SERVER_NAME; ?>";
  getDataObj['user_email'] = "<?php echo $module->getUser()->getEmail(); ?>";
  getDataObj['redcap_user'] = "<?php echo $module->getUser()->getUserName(); ?>";
  // store URL fore services/refreshSession.php
  getDataObj['refresh_session_url'] = "<?php echo $module->getUrl("services/refreshSession.php"); ?>";
  getDataObj['exit_url'] = "<?php echo APP_PATH_WEBROOT_FULL
      . 'redcap_' . $redcap_version .'index.php?pid=' . PROJECT_ID; ?>" ;
  getDataObj['max_cohort_size'] = "<?php echo $module->getSystemSetting("get-data-limit") ?: 600; ?>" ;
  getDataObj['new_dpa_url'] = 'https://redcap.stanford.edu/surveys/?s=L3TRTT9EF9';
  getDataObj['addon_dpa_url'] = 'https://redcap.stanford.edu/surveys/?s=8RWF73YTWA'
  getDataObj['add_dpa_to_irb_url'] = 'https://med.stanford.edu/starr-tools/data-compliance/modify-existing-protocol.html';
  localStorage.setItem('getDataObj', JSON.stringify(getDataObj));

  // redirect to 'new-project' Vue app for creating a new project
  //window.location = "<--?php echo $module->getUrl("pages/js/duster/get-data/dist/index.html"); ?-->";

</Script>

<script type="module" crossorigin src="<?php echo $module->getUrl("pages/js/duster/get-data/dist/index.js"); ?>"></script>
<link rel="stylesheet" href="<?php echo $module->getUrl("pages/js/duster/get-data/dist/index.css"); ?>">

<div id="app">

</div>
