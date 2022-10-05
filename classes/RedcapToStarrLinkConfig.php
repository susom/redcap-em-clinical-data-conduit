<?php

namespace Stanford\Duster;

class RedcapToStarrLinkConfig
{
    private $project_id, $module;
    /*
     * this is just for my reference.  will delete later.
    private $rts_settings = "enable-project-debug-logging,cohorts,id-source,starr-id-field,starr-event-name,include-logic,status-field,query-date1,query-date1-event,query-date2,query-date2-event,query-date3,query-date3-event,query-int1,query-int1-event,query-int2,query-int2-event,query-num1,query-num1-event,query-num2,query-num2-event,query-string1,query-string1-event,query-string2,query-string2-event,query-date4,query-date4-event,query-date5,query-date5-event";

    private $query_settings="queries,query-name,data-location,data-store-event,include-form-list,exclude-field-list,
    redcap-cohort,sync-on-save,save-instrument,cron-freq";*/

    public function __construct($pid, $module)
    {
        $this->project_id = $pid;
        $this->module = $module;
    }

    /*enable RtoS Link EM in the project*/
    public function enableRedcapToStarrLink() {
        $this->module->enableModule($this->project_id, "redcap_to_starr_link");
        $this->module->emDebug('Enabling REDCap to STARR Link on project.');
    }

    /*takes JsonObject returned from starr-api to configure project level RtoS Link EM settings*/
    public function configureRedcapToStarrLink($em_config) {
        // there's no api for this so just saving settings directly to database
        $data_sync_settings = $em_config['rcToStarrLinkConfig']['dataSync'];
        $this->module->emDebug('data_sync_settings: ' . print_r($data_sync_settings, true));

        foreach ($data_sync_settings as $key=>$setting) {
            $this->saveSetting($key, $this->transformSetting($key, $setting));
        }

        // these settings are for the data queries
        $data_queries = $em_config['rcToStarrLinkConfig']['queries'];
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

    /*constructs the url to call RtoStarr Link api
    @return "1" if successful*/
    private function invokeRedcapToStarrLink($action, $query) {
        $url = APP_PATH_WEBROOT_FULL .
            'api/?type=module&prefix=redcap_to_starr_link&page=src%2FRedcapProjectToStarrLink&NOAUTH' .
            '&action=' . $action . // should be either data or records
            '&pid=' . $this->project_id .
            '&user=' . $this->module->getUser()->getUserName();
        if ($query) {
            $url = $url . '&query='.$query;
        }
        $curl = curl_init($url);

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $headers = array(
            "Accept: text/html",
            "Content-Type: text/html"
        );
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        $resp = curl_exec($curl);
        if (!json_encode($resp)) {
            $curl_error = curl_error($curl);
            //TODO
        }
        curl_close($curl);
        $this->module->emLog("$url response = " . json_encode($resp));
        return $resp;
    }

    /* call the RtoS Link api to sync the records
    * @return "1" if successful
    */
    public function syncCohort() {
        return $this->invokeRedcapToStarrLink("records", null);
    }

    /* call the RtoS Link api to getData
     *if $queryName is null, then all queries will be executed
     * @param $queryName as configured in RtoS Link EM
     * @return "1" if successful
     */
    public function updateData($queryName) {
        return $this->invokeRedcapToStarrLink("data", $queryName);
    }

    /*returns RtoSt Link configured queries
    @return array*/
    public function getQueryNames() {
        $em_id = $this->getEmId();
        $result = $this->module->query(
            "select `value` from redcap_external_module_settings where `key`='query-name' and `external_module_id` = ? and `project_id`=?",
            [$em_id, $this->project_id]);
        if ($result->num_rows > 0) {
            $query_names = json_decode($result->fetch_assoc()['value'], true);
        }
        $this->module->emDebug('query_names: ' . $query_names);
        return $query_names;
    }

    /* This is just using the form name to label the query since there's only one query per form
right now.  Will need to figure out something different in the future if there are multiple queries per form*/
    public function getQueries() {
        $em_id = $this->getEmId();
        $names_result = $this->module->query(
            "select `value` from redcap_external_module_settings where `key`='query-name' and `external_module_id` = ? and `project_id`=?",
            [$em_id, $this->project_id]);
        $forms_result = $this->module->query(
            "select `value` from redcap_external_module_settings where `key`='save-instrument' and `external_module_id` = ? and `project_id`=?",
            [$em_id, $this->project_id]);
        if ($names_result->num_rows > 0) {
            $query_names = json_decode($names_result->fetch_assoc()['value'], true);
            $form_names = json_decode($forms_result->fetch_assoc()['value'], true);
        }
        $queries=[];
        foreach($form_names as $index=>$form_name) {
            $label_result = $this->module->query(
                "select `form_menu_description` from redcap_metadata where `form_name`=? and `project_id`=? and `form_menu_description` is not null",
                [$form_name, $this->project_id]);
            $label = $label_result->fetch_assoc()['form_menu_description'];
            $queries[] = array('query_name'=>$query_names[$index],
                                'query_label'=>$label) ;
        }

        $this->module->emDebug('queries: ' . print_r($queries, true));
        return $queries;
    }

    /*returns the RtoS Link external module id from redcap
    @return int*/
    public function getEmId()
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

    /*convenience method to apply transformations to external module setting values
    @return double quoted strings or "null" string*/
    private function transformSetting($key, $setting)
    {
        $this->module->emDebug("key: ".$key.", pre-setting: ".$setting);
        $event_id = strval($this->module->getEventId());
        return ($setting == null || $setting=='null') ? 'null' :
            ((strpos($key, 'event') > -1) ? '"'.$event_id .'"':
                '"'.$setting.'"');
    }

    /*save EM configuration settings
    @param $key string
    @param $setting string*/
    private function saveSetting($key, $setting){
        $em_id = $this->getEmId();
        $this->module->query(
            "insert into redcap_external_module_settings (`external_module_id`, `project_id`,
                                             `key`, `type`, `value`) values (?,?,?,?,?)",
            [$em_id, $this->project_id, $key, 'json-array', '['.$setting.']']);
    }
}
