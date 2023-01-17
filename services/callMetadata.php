<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to retrieve DUSTER metadata for new-project Vue app via STARR-API
 */

$metadata = $module->getMetadata();
echo json_encode($metadata);
?>
