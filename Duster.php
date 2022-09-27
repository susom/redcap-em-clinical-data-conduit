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

    /* when duster is run post project creation*/
    /*    public function redcap_every_page_top() {
        // add query to see if it's a duster project from survey
        if (strpos(PAGE, "index.php") !==false && $_GET['msg']==='newproject'
            && !$_GET['dustercomplete']) {
            $this->emDebug("In Every Page Top Hook project id :" . $this->getProjectId() . " Page is " . PAGE);
            $some = "<script> window.location = '" . $this->getUrl("pages/newProjectIntro.php", false, true) . "' ; </script>";
            echo $some;
    }}*/

    // public function redcap_every_page_top($project_id) {
    public function redcap_every_page_top() {
        $this->emDebug(" Page is " . PAGE . " action is " . $_GET['action']);
        if (strpos(PAGE, "index.php") !==false && $_GET['action'] === 'create') {
            $this->emDebug("In Every Page Top Hook project id :" . $this->getProjectId() . " Page is " . PAGE);
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

    private function getValidToken($service) {
        $token = false;
        try {
            $tokenMgnt = \ExternalModules\ExternalModules::getModuleInstance('vertx_token_manager');
            $token = $tokenMgnt->findValidToken($service);
        } catch (Exception $ex) {
            $this->emError("Could not find a valid token for service ddp");
        }
        return $token;
    }

    public function starrApiGetRequest($url, $service) {
        $token = $this->getValidToken($service);
        $resp_arr=[];
        if ($token !== false) {
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $headers = array(
                "Accept: application/json",
                "Content-Type: application/json",
                "Authorization: Bearer " . $token
            );
            curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
            $resp = curl_exec($curl);
            curl_close($curl);
            $resp_arr = json_decode($resp, true);

        }
        //$this->emLog("$url response = " . print_r($resp_arr, true));
        return $resp_arr;
    }

    public function starrApiPostRequest($url, $service, $post_fields) {
        $token = $this->getValidToken($service);
        $resp_arr=[];
        $message= json_encode($post_fields);
        $content_type = 'application/json';
        if ($token !== false) {
            $headers = array(
                "Content-Type: ". $content_type,
                "Authorization: Bearer " . $token,
                "Content-Length: ".  length($message)
            );
            $this->emDebug("headers: " . print_r($headers, true));

            $response = http_post($url, $message, null, $content_type, null, $headers);
            $resp_arr = json_decode($response, true);
            $this->emDebug("Returned from getData api ");
            if (!$resp_arr) {
                $this->emDebug("$url response: " . print_r($resp_arr, true));
            }
        }
        return $resp_arr;
    }

    public function getMetadata() {
        // build and send GET request to metadata webservice
        $metadata_url = $this->getSystemSetting("starrapi-metadata-url");
        $metadata = $this->starrApiGetRequest($metadata_url,'ddp');
            // $metadata = $resp_arr["results"];
            /*
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
        */

        return $metadata;
    }

    /*public function getDusterConfig() {
        // build and send GET request to config webservice
        $config_url = $this->getSystemSetting("starrapi-config-url") . $this->getProjectId();
        $this->emDebug("config url = $config_url");
        $duster_config = $this->getFromDdp($config_url);
        //$this->emDebug('duster_config = ' . print_r($duster_config, true));
        return $duster_config;
    }*/

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
}
