<?php
namespace Stanford\Duster;
/** @var $module Duster */

/**
 * service page to keep the REDCap session alive, called by Vue apps intermittently
 */

$module->emLog("Request sent to services/refreshSession.php");
echo 1;
?>
