<?php
namespace Stanford\Duster;
/** @var $module Duster */

use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";

/**
 * entrypoint to DUSTER's edit project UI (Vue app)
 */

// load project's dataset design


$pid = $module->getProjectId();
$irb = $module->getProjectIrb($pid);
// TODO error handle if irb isn't valid or empty, or call to getProjectIrb() fails
$duster_config_obj = new DusterConfigClass($pid, $module);
$design_config = json_encode($duster_config_obj->getDesignConfig());

// $project_title = $module->getTitle();

/*
$design_url = $module->getUrl("services/getDatasetDesigns.php", false, true);
$module->emLog($design_url);
$curl = curl_init($design_url);
curl_setopt($curl, CURLOPT_URL, $design_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
/
$headers = array(
  "Accept: application/json",
  "Content-Type: application/json",
);
//curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
$module->emDebug("PID: $pid. GET request to $design_url");
$response = curl_exec($curl);
$resp_code = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$curl_error = curl_error($curl);
$module->emLog($response);
// $module->emLog($resp_code);
// $module->emLog($curl_error);
$response = (json_decode($response) === false) ? $response : json_decode($response, true);
if (!empty($response['status']) && $response['status'] !== 200) {
  $this->handleError("ERROR: ",
    "URL: $design_url<br>RESPONSE BODY: " . print_r($response['body'], true)
    . "<br>RESPONSE CODE: " . $response['status']
    . "<br>ERROR: " . $response['message']);
}
curl_close($curl);

$project_design = $response['data'];
*/
?>

<!DOCTYPE html>
<html lang="en">
<h1>
  DUSTER: Edit Project
</h1>
<p>Hitting the button below will launch an application where you may perform the following modifications to your project:</p>
<ol>
  <li>Add new Researcher-Provided Information.</li>
  <li>Select additional demographics.</li>
  <li>Add new data collection windows.</li>
  <li>Add new clinical variables to pre-existing data collection windows.</li>
  <!-- <li>Select additional aggregations to pre-existing clinical variables in data collection windows.</li> -->
</ol>
<button
  type="button"
  onclick="window.location = '<?php echo $module->getUrl("pages/js/duster/new-project/dist/index.html"); ?>';"
>Launch Editor
</button>
</html>

<!-- axios CDN -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>

  setInterval(() => {
    axios.get("<?php echo $module->getUrl("services/refreshSession.php"); ?>")
      .then(function (response) {
      })
      .catch(function (error) {
      });
  },60000);

  localStorage.removeItem('postObj');
  let postObj = {};
  postObj['redcap_csrf_token'] = "<?php echo $module->getCSRFToken(); ?>";
  postObj['edit_mode'] = true;
  postObj['redcap_project_id'] = "<?php echo $pid; ?>";
  postObj['project_irb_number'] = "<?php echo $irb; ?>";
  postObj['initial_design'] = <?php echo $design_config; ?>;

  // store URL for services/reportFatalError.php
  postObj['report_fatal_error_url'] = "<?php echo $module->getUrl("services/reportFatalError.php"); ?>";
  // store URL for services/checkIRB.php
  postObj['check_irb_url'] = "<?php echo $module->getUrl("services/checkIRB.php"); ?>";
  // store URL for services/callMetadata.php
  postObj['metadata_url'] = "<?php echo $module->getUrl("services/callMetadata.php"); ?>";
  // store URL for services/getDatasetDesigns.php
  postObj['get_dataset_designs_url'] = "<?php echo $module->getUrl("services/getDatasetDesigns.php"); ?>";
  // store URL for services/refreshSession.php
  postObj['refresh_session_url'] = "<?php echo $module->getUrl("services/refreshSession.php"); ?>";
  localStorage.setItem('postObj', JSON.stringify(postObj));

</script>
