<?php

namespace Stanford\Duster;

class RedcapToStarrLinkConfig
{
    private $project_id, $module, $em_config, $em_id;
    /*
     * this is just for my reference.  will delete later.
    private $rts_settings = "enable-project-debug-logging,cohorts,id-source,starr-id-field,starr-event-name,include-logic,status-field,query-date1,query-date1-event,query-date2,query-date2-event,query-date3,query-date3-event,query-int1,query-int1-event,query-int2,query-int2-event,query-num1,query-num1-event,query-num2,query-num2-event,query-string1,query-string1-event,query-string2,query-string2-event,query-date4,query-date4-event,query-date5,query-date5-event";

    private $query_settings="queries,query-name,data-location,data-store-event,include-form-list,exclude-field-list,
    redcap-cohort,sync-on-save,save-instrument,cron-freq";*/

    public function __construct($pid, $module, $em_config)
    {
        $this->project_id = $pid;
        $this->module = $module;
        $this->em_config = $em_config;
        $this->module->emDebug('em_config: ' . print_r($em_config, true));
        $this->em_id = $this->getEmId();
    }

    public function enableRedcapToStarrLink() {
        $this->module->enableModule($this->project_id, "redcap_to_starr_link");
    }

    public function configureRedcapToStarrLink() {
        // there's no api for this so just saving settings directly to database
        $data_sync_settings = $this->em_config['rcToStarrLinkConfig']['dataSync'];
        $this->module->emDebug('data_sync_settings: ' . print_r($data_sync_settings, true));

        foreach ($data_sync_settings as $key=>$setting) {
            $this->saveSetting($key, $this->transformSetting($key, $setting));
        }

        // these settings are for the data queries
        $data_queries = $this->em_config['rcToStarrLinkConfig']['queries'];
        $this->module->emDebug("data queries: ".print_r($data_queries, true));

        $query_settings = [];
        foreach($data_queries as $data_query) {
            foreach($data_query as $key=>$data_query_setting) {
                if (!$query_settings[$key]) {
                    $query_settings[$key] = [];
                }
                array_push($query_settings[$key], $this->transformSetting($key, $data_query_setting));
            }
        }

        foreach($query_settings as $key=>$data_query_setting) {
            $this->saveSetting($key, implode(',',$data_query_setting));
        }
    }

    private function invokeRedcapToStarrLink($action, $query) {
        $url = APP_PATH_WEBROOT_FULL .
            'api/?type=module&prefix=redcap_to_starr_link&page=src%2FRedcapProjectToStarrLink&NOAUTH" .
            &action=' . $action . // should be either data or records
            '&pid=' . $this->project_id .
            '&user=' . $this->module->getUser()->getUserName();
        if ($query) {
            $url = $url . '&query='.$query;
        }
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $headers = array(
            "Accept: application/json",
            "Content-Type: application/json"
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        $resp = curl_exec($curl);
        curl_close($curl);
        $resp_arr = json_decode($resp, true);
        //$this->emLog("$url response = " . print_r($resp_arr, true));
        return $resp_arr;
    }

    public function updateCohort() {
        $this->invokeRedcapToStarrLink("records", null);
    }

    // if needed we can just query demographics or clinical windows separately
    public function updateData() {
        $data_queries = $this->em_config['rcToStarrLinkConfig']['queries'];
        foreach($data_queries as $data_query) {
            $this->invokeRedcapToStarrLink("data", $data_query['query-name']);
        }
        /*duster_pid73_demographics
         duster_pid73_cw0
         duster_pid73_cw1
         duster_pid73_cw2
         */
    }

    private function getEmId()
    {
        $ex_mod_result = $this->module->query(
            "select external_module_id from redcap_external_modules where directory_prefix = ?",
            ['redcap_to_starr_link']);
        if ($ex_mod_result->num_rows > 0) {
            $rts_ex_mod_id = $ex_mod_result->fetch_assoc()['external_module_id'];
        }
        $this->module->emDebug('external module id: ' . $rts_ex_mod_id);
        return $rts_ex_mod_id;
    }

    // should return null or double quoted string
    private function transformSetting($key, $setting)
    {
        $this->module->emDebug("key: ".$key.", pre-setting: ".$setting);
        $event_id = strval($this->module->getEventId());
        return ($setting == null || $setting=='null') ? 'null' :
            ((strpos($key, 'event') > -1) ? '"'.$event_id .'"':
                '"'.$setting.'"');
    }

    private function saveSetting($key, $setting){
        $this->module->query(
            "insert into redcap_external_module_settings (`external_module_id`, `project_id`, 
                                             `key`, `type`, `value`) values (?,?,?,?,?)",
            [$this->em_id, $this->project_id, $key, 'json-array', '['.$setting.']']);
    }
}
