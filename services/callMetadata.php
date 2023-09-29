<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to retrieve DUSTER metadata for new-project Vue app via STARR-API
 */
$results = $module->getMetadata();
if ($results === null) {
  http_response_code(404);
} else if (array_key_exists('status', $results)) {
  http_response_code($results['status']);
}

echo json_encode($results);
?>
