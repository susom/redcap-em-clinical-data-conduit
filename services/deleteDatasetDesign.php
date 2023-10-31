<?php
namespace Stanford\Duster;
/** @var $module Duster */

use RedCapDB;

/**
 * service page to delete a DUSTER dataset design
 */

/**
 * avoiding false-positive Psalm TaintedSSRF on $_POST['data']
 * @psalm-taint-escape ssrf
 */

/* validate parameters from request */
// $data = json_decode($_POST['data'], true);
if (!array_key_exists('title', $_POST) || $_POST['title'] === "") {
  http_response_code(400);
  $msg = $module->handleError('DUSTER Error: Delete Dataset Design',  "Missing 'title' parameter in request to delete a dataset design.");
  echo 'Error in request to delete a dataset design.';
  exit();
}

/* send STARR-API POST request to delete a dataset design in postgres table */

// set up the POST body as an array
$post_body = array(
  'redcap_user_name' => $module->getUser()->getUserName(),
  'redcap_server_name' => SERVER_NAME,
  'title' => $_POST['title']
);

// Retrieve the data URL that is saved in the config file
$dataset_design_url = $module->getSystemSetting("starrapi-dataset-design-url") . '/delete';

// send POST request to DUSTER's config route in STARR-API
$delete_design_results = $module->starrApiPostRequest($dataset_design_url, 'ddp', $post_body);
if ($delete_design_results === null) {
  http_response_code(500);
  echo "STARR-API Post Request failed to delete a dataset design";
  exit();
} else if (array_key_exists('status', $delete_design_results)) {
  http_response_code($delete_design_results['status']);
  exit();
}

echo json_encode($delete_design_results);
exit();
?>
