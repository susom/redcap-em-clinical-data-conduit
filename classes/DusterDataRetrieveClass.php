<?php
namespace Stanford\Duster;

/**
 * Class: DusterDataClass
 * This class handles the API to retrieve and save data.
 */

use REDCap;

class DusterDataRetrieveClass
{
    private $project_id, $module;

    public function __construct($pid, $module)
    {
        $this->project_id = $pid;
        $this->module = $module;
    }

    public function queryAndSave($queryObject) {
        $url = $this->module->getSystemSetting("starrapi-data-url");
        $this->module->emDebug('getData url: ' . $url);
        $this->module->emDebug('queryObject: ' . print_r($queryObject, true));
        //$cohort['redcap_project_id'] = intval($this->project_id);
        //$cohort['cohort'] = $queryObject;

        $data = $this->module->starrApiPostRequest($url, 'ddp', $queryObject);
        $this->module->emDebug('starrApi response: ' . print_r($data, true));
        if ($data) {
            $resp = REDCap::saveData($this->project_id, 'json', json_encode($data));
            $this->module->emDebug('redcap save response: ' . print_r($resp, true));
            $resp['data'] = $data;
        }
        return $resp;
    }
}
