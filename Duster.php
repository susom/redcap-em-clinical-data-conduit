<?php
namespace Stanford\Duster;

// use Couchbase\ParsingFailureException;
use REDCap;
use ExternalModules\ExternalModules;
use Exception;
// use ExternalModules\Framework;

require_once "emLoggerTrait.php";

class Duster extends \ExternalModules\AbstractExternalModule {

    use emLoggerTrait;

    // public function redcap_every_page_top($project_id) {
    public function redcap_every_page_top() {
        // $this->emDebug("In Every Page Top Hook project id :" . $project_id . " Page is " . PAGE);
        if (PAGE === "index.php" && $_GET['action'] === 'create') {
            $some = "<script> let dusterUrl = '" . $this->getUrl("pages/newProjectIntro.php", false, true) . "' ; </script>";
            echo $some;

            $script = <<<EOD
                <script>
                    $(document).ready(function() {
                        let div = "<div style='text-indent: -1.5em; margin-left: 1.5em;'><input name='project_template_radio' id='project_template_duster' type='radio'>" ;
                        div += "<label style='text-indent:3px;margin-top:4px;margin-bottom:0;cursor:pointer;' for='project_template_duster'>Create project using DUSTER</label>" ;
                        div += "</div>" ;
                        $("#project_template_radio0").closest('td').append(div) ;

                        let btn = '<button type="button" class="btn btn-primaryrc" id="dusterSubmitBtn">Create Project</button>' ;
                        let defaultCreateBtn = $("button.btn-primaryrc").hide() ;
                        $("button.btn-primaryrc").closest('td').prepend(btn) ;

                        $("#dusterSubmitBtn").on('click', function() {
                            if ($("#project_template_duster").prop("checked")) {
                                if (checkForm()) {
                                    $("form[name='createdb']").attr('action', dusterUrl) ;
                                    defaultCreateBtn.click() ;
                                }
                            } else {
                                defaultCreateBtn.click() ;
                            }
                        }) ;
                    }) ;
                </script>
            EOD;

            echo $script;
        }
    }

    public function getMetadata() {
        // build and send POST request to metadata webservice
        $metadata_url = $this->getSystemSetting("starrapi-metadata-url");

        try {
            $tokenMgnt = \ExternalModules\ExternalModules::getModuleInstance('vertx_token_manager');
            $token = $tokenMgnt->findValidToken('ddp');
        } catch (Exception $ex) {
            $this->emError("Could not find a valid token for service ddp");
            $token = false;
        }
        if($token !== false) {
            $curl = curl_init($metadata_url);
            curl_setopt($curl, CURLOPT_URL, $metadata_url);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

            $headers = array(
                "Accept: application/json",
                "Content-Type: application/json",
                "Authorization: Bearer " . $token
            );
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

            $data = <<<DATA
                    {
                    }
                    DATA;

            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

            $resp = curl_exec($curl);
            curl_close($curl);
            $resp_arr = json_decode($resp, true);
            $fields_arr = $resp_arr["results"];

            $demographics_arr = [];
            $outcomes_arr = [];
            $labs_arr = [];
            $vitals_arr = [];
            $scores_arr = [];
            $oxygenation_arr = [];
            foreach ($fields_arr as $field) {
                switch ($field["category"]) {
                    case "Demographics":
                        $demographics_arr[$field["field"]] = $field;
                        break;
                    case "Outcomes":
                        $outcomes_arr[$field["field"]] = $field;
                        break;
                    case "Labs":
                        $labs_arr[$field["field"]] = $field;
                        break;
                    case "Vitals":
                        $vitals_arr[$field["field"]] = $field;
                        break;
                    case "Scores":
                        $scores_arr[$field["field"]] = $field;
                        break;
                    case "Oxygenation":
                        $oxygenation_arr[$field["field"]] = $field;
                        break;
                    default: // TODO error
                        break;
                }
            }
        }
        $metadata = array(
            "demographics" => $demographics_arr,
            "outcomes" => $outcomes_arr,
            "labs" => $labs_arr,
            "vitals" => $vitals_arr,
            "scores" => $scores_arr,
            "oxygenation" => $oxygenation_arr
        );
        $this->emLog($metadata);
        return $metadata;
    }

    /**
     * Fetch user information from corresponding API token
     * @param String $token
     * @return String $project_id
     * @throws Exception
     */
    public function getUserProjectFromToken($token)
    {
        $sql = "
            SELECT project_id
            FROM redcap_user_rights
            WHERE api_token = ?";
//        $q = ExternalModules::createQuery();
        $q = $this->createQuery();
        $q->add($sql, [$token]);
        $result = $q->execute();
        $num_results = $q->affected_rows;
        if ($num_results === 1) {
            $row = $result->fetch_assoc();
          // return array($row['username'], $row['project_id']);
            return $row['project_id'];
        } else {
            throw new Exception ("Returned $num_results in " . __METHOD__ . " from token '$token'");
        }
    }

    /*
    public function enableDusterOnProject($project_id) {
        // check $project_id is a valid project id before calling enableModule()
        if($this->isValidProjectId($project_id)) {
            $this->enableModule($project_id, NULL);
        } else {
            // TODO error
        }
    }
    */

    // normally, ProjectSetup\modify_project_setting_ajax.php is hit with a POST request when manually enabling DDP in project setup
    // the SQL used here is taken from that PHP file
    public function enableDDP($project_id) {
        // saveProjectSetting($(this),'realtime_webservice_enabled','1','0',1,'setupChklist-modules');
        $sql = "
                UPDATE redcap_projects
                SET
                    realtime_webservice_enabled = '1',
                    realtime_webservice_type = 'CUSTOM'
                WHERE project_id = ?
                ";

        $q = $this->createQuery();
        $q->add($sql, $project_id);
        $q->execute();
        if($q->affected_rows === 1 /* TODO || DDP is already enabled*/) {
            // TODO success
        } else {
            // TODO fail or DDP was already enabled
        }
    }
}
