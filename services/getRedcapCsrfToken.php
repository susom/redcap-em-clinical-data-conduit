<?php
namespace Stanford\Duster;
/** @var $module Duster */

use RedCapDB;

/**
 * service page to retrieve a REDCap CSRF Token
 */

echo $module->getCSRFToken();
exit();
?>
