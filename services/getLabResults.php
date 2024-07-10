<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * TODO
 */

$search_url = $module->getSystemSetting("starrapi-metadata-url") . '/labs/';
$module->emLog($search_url);
$results = $module->starrApiGetRequest($search_url, 'ddp');
$module->emLog($results);
// error handled by starrApiGetRequest
if ($results === null) {
  http_response_code(500);
} else if (array_key_exists('status', $results)) {
  http_response_code($results['status']);
}

echo json_encode($results);
?>
