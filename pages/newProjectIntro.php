<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * entrypoint to DUSTER's new project creation UI (Vue app)
 * stores POST form data in REDCap's new project creation page and URLs in local storage and redirects to Vue app
 */
?>

<Script>
  localStorage.removeItem('postObj');
  let postObj = {};
  postObj['redcap_csrf_token'] = "<?php echo $module->getCSRFToken(); ?>";
  // form data initially entered by user on initial create new project page (/index.php?action=create)
  postObj['surveys_enabled'] = "<?php echo htmlentities($_POST["surveys_enabled"], ENT_QUOTES); ?>";
  postObj['repeatforms'] = "<?php echo htmlentities($_POST["repeatforms"], ENT_QUOTES); ?>";
  postObj['scheduling'] = "<?php echo htmlentities($_POST["scheduling"], ENT_QUOTES); ?>";
  postObj['randomization'] = "<?php echo htmlentities($_POST["randomization"], ENT_QUOTES); ?>";
  postObj['app_title'] = "<?php echo htmlentities($_POST["app_title"], ENT_QUOTES); ?>";
  postObj['purpose'] = "<?php echo htmlentities($_POST["purpose"], ENT_QUOTES); ?>";
  postObj['project_pi_firstname'] = "<?php echo htmlentities($_POST["project_pi_firstname"], ENT_QUOTES); ?>";
  postObj['project_pi_mi'] = "<?php echo htmlentities($_POST["project_pi_mi"], ENT_QUOTES); ?>";
  postObj['project_pi_lastname'] = "<?php echo htmlentities($_POST["project_pi_lastname"], ENT_QUOTES); ?>";
  postObj['project_pi_email'] = "<?php echo htmlentities($_POST["project_pi_email"], ENT_QUOTES); ?>";
  postObj['project_pi_alias'] = "<?php echo htmlentities($_POST["project_pi_alias"], ENT_QUOTES); ?>";
  postObj['project_irb_number'] = "<?php echo htmlentities($_POST["project_irb_number"], ENT_QUOTES); ?>";
  postObj['purpose_other'] = "<?php echo htmlentities(implode(",", $_POST["purpose_other"]), ENT_QUOTES); ?>";
  postObj['project_note'] = "<?php echo htmlentities($_POST["project_note"], ENT_QUOTES); ?>";
  postObj['projecttype'] = "<?php echo htmlentities($_POST["projecttype"], ENT_QUOTES); ?>";
  postObj['repeatforms_chk'] = "<?php echo htmlentities($_POST["repeatforms_chk"], ENT_QUOTES); ?>";
  postObj['project_template_radio'] = "<?php echo htmlentities($_POST["project_template_radio"], ENT_QUOTES); ?>";

  postObj['img_base_path'] = "<?php echo $module->getUrl("images/"); ?>";
  postObj['img_base_path'] = postObj['img_base_path'].split("?")[0] ;

  postObj['redcap_new_project_url'] = "<?php echo APP_PATH_WEBROOT_FULL . "index.php?action=create"; ?>";

  // store URL for services/checkIRB.php
  postObj['check_irb_url'] = "<?php echo $module->getUrl("services/checkIRB.php"); ?>" ;

  // store URL for services/createProject.php
  postObj['create_project_url'] ="<?php echo $module->getUrl("services/createProject.php"); ?>";

  // store URL for services/callMetadata.php
  postObj['metadata_url'] = "<?php echo $module->getUrl("services/callMetadata.php"); ?>";

  // store URL for pages/newProjectIntro.php
  postObj['new_project_intro_url'] ="<?php echo $module->getUrl("pages/newProjectIntro.php"); ?>";
  localStorage.setItem('postObj', JSON.stringify(postObj));

  // redirect to 'new-project' Vue app for creating a new project
  window.location = "<?php echo $module->getUrl("pages/js/vue/duster/dist/index.html"); ?>";

</Script>

