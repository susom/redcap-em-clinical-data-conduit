<?php
namespace Stanford\Duster;
/** @var $module Duster */

use RedCapDB;

/**
 * service page to save or update a DUSTER dataset design
 */

/**
 * avoiding false-positive Psalm TaintedSSRF on $_POST['data']
 * @psalm-taint-escape ssrf
 */

/* validate parameters from request */
// $data = json_decode($_POST['data'], true);
if (!array_key_exists('title', $_POST) || $_POST['title'] === "") {
  http_response_code(400);
  $msg = $module->handleError('DUSTER Error: Save/Update Dataset Design',  "Missing 'title' parameter in request to save/update a dataset design.");
  echo 'Error in request to save/update dataset design.';
  exit();
}
if (!array_key_exists('design', $_POST) || $_POST['design'] === "") {
  http_response_code(400);
  $msg = $module->handleError('DUSTER Error: Save/Update Dataset Design',  "Missing 'design' parameter in request to save/update a dataset design.");
  echo 'Error in request to save/update dataset design.';
  exit();
}

/* send STARR-API POST request to save/update dataset design in postgres */

// set up the POST body as an array
$post_body = array(
  'redcap_user_name' => $module->getUser()->getUserName(),
  'redcap_server_name' => SERVER_NAME,
  'title' => $_POST['title'],
  'design' => $_POST['design']
);

// Retrieve the data URL that is saved in the config file
$dataset_design_url = $module->getSystemSetting("starrapi-save-dataset-design-url");

// send POST request to DUSTER's config route in STARR-API
$save_design_results = $module->starrApiPostRequest($dataset_design_url, 'ddp', $post_body);
if ($save_design_results === null) {
  http_response_code(500);
  echo "STARR-API Post Request failed to save/update dataset design";
  exit();
} else if (array_key_exists('status', $save_design_results)) {
  http_response_code($save_design_results['status']);
  exit();
}

echo json_encode($save_design_results);
exit();
?>
