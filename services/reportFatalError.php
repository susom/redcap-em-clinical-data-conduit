<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to report a fatal error
 */

$fatal_error = isset($_POST["fatal_error"]) ?
  $_POST["fatal_error"]
  : 'A fatal error occurred, but no fatal error was sent as part of POST request to /services/reportFatalError.php.';

$results = $module->handleError("ERROR: REDCap Fatal Error", $fatal_error);

echo $results;
?>
