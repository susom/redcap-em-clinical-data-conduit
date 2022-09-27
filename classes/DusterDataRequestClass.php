<?php

namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */

require_once $module->getModulePath() . "classes/DusterConfigClass.php";

/**
 * Class: DusterDataClass
 * This class handles the API to retrieve the duster cohort.
 */

use REDCap;


class DusterDataRequestClass
{
    private $project_id, $duster_config, $module;

    public function __construct($pid, $module)
    {
        $this->project_id = $pid;
        $this->module = $module;
    }

    /*convenience function for testing*/
    public function getDummyRequestObject()
    {
        $string = file_get_contents($this->module->getModulePath() . 'classes/sample_response.json',
            FILE_USE_INCLUDE_PATH);
        $this->module->emDebug('DUMMY :' . $string);
        return $string;
    }

    /**
     * Fetch researcher provided data.  Returns JsonObject
     * { "redcap_project_id":
     *   "missing_vars":
     *   "missing_data":
     *   "rp_data":
     * }
     * @return Json encoded string
     */
    public function getDusterRequestObject()
    {
        if ($this->duster_config == null) {
            $this->duster_config = new DusterConfigClass($this->project_id, $this->module);
            $this->duster_config->loadConfig();
        }
        $rp_data['redcap_project_id'] = intval($this->project_id);
        $rp_data['missing_fields'] = $this->duster_config->getMissingRedcapFields();

        if (empty($rp_data['missing_fields'])) {
            // add rp_identifiers to request fields
            $duster_config = $this->duster_config->getDusterConfig();
            foreach ($duster_config['rp_info']['rp_identifiers'] as $identifier) {
                $rp_fields[] = $identifier['redcap_field_name'];
            }
            // add rp_dates to request fields
            foreach ($duster_config['rp_info']['rp_dates'] as $rp_dates) {
                $rp_fields[] = $rp_dates['redcap_field_name'];
            }
            $this->module->emDebug('$request_fields: ' . print_r($rp_fields, true));
            $records = REDCap::getData('array', null, $rp_fields);

            // populate $rp_data with data in $records
            foreach ($records as $record_id => $record) {
                $has_missing = false;
                $request_record = [];
                $request_record['redcap_record_id'] = strval($record_id);
                $record = $record[$this->module->getEventId()];
                // add rp_identifiers
                foreach ($duster_config['rp_info']['rp_identifiers'] as $identifier) {
                    $request_record[$identifier['redcap_field_name']] = $record[$identifier['redcap_field_name']];
                    $has_missing = $has_missing || empty($request_record[$identifier['redcap_field_name']]);
                }
                //$request_record['dates'] = [];
                // add rp_dates
                $date_obj = [];
                foreach ($duster_config['rp_info']['rp_dates'] as $rp_dates) {
                    $date_obj['redcap_field_name'] = $rp_dates['redcap_field_name'];
                    $date_obj['value'] = $record[$rp_dates['redcap_field_name']];
                    $date_obj['type'] = $rp_dates['format'];
                    $request_record['dates'][] = $date_obj;
                    $has_missing = $has_missing || empty($date_obj['value']);
                }
                if ($has_missing) {
                    $rp_data['missing_data'][] = $request_record;
                }
                // add everything to rp_data including missing
                $rp_data['rp_data'][] = $request_record;

            }
        }
        return $rp_data;
    }

}
