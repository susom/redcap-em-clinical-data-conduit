<?php
namespace Stanford\Duster;

use REDCap;
use ExternalModules\ExternalModules;
use Exception;
require_once "emLoggerTrait.php";

/**
 * Class Duster
 * @package Stanford\Duster
 *
 * This external module is an all-in-one solution to design and create clinical datasets as REDCap projects,
 * as well as fetch clinical data for REDCap projects by leveraging STARR-API and REDCap to STARR Link
 *
 */
class Duster extends \ExternalModules\AbstractExternalModule {

  use emLoggerTrait;

  /**
   * Hook to show DUSTER as an option in the 'New Project' page
   * Only shows DUSTER option if:
   *  1) user is allowlisted in the System-level config
   *  2) purpose selected on 'New Project' page is 'Research'
   * @return void
   */
  public function redcap_every_page_top($project_id) {
      $this->test();
    // $this->emDebug(" Page is " . PAGE . " action is " . $_GET['action']);
    if ($project_id === null
      && strpos(PAGE, "index.php") !== false
      && $_GET['action'] === 'create'
      && $this->isUserAllowed() === true) {
        // $this->emDebug("In Every Page Top Hook project id :" . $this->getProjectId() . " Page is " . PAGE);
        $some = "<script> let dusterUrl = '" . $this->getUrl("pages/newProjectIntro.php", false, true) . "' ; </script>";
        echo $some;
        $script = <<<EOD
                <script>
                    $(document).ready(function() {
                        const dusterLabel = "Create project using DUSTER";
                        const dusterDesc = "DUSTER is a self-service clinical dataset designer/import tool for research studies utilizing STARR data. For more information, visit https://med.stanford.edu/duster.html.";
                        let div = "<div id='duster_option' style='text-indent: -1.5em; margin-left: 1.5em; display: none;'><input name='project_template_radio' id='project_template_duster' type='radio'>" ;
                        div += "<label style='text-indent:3px;margin-top:4px;margin-bottom:0;cursor:pointer;' for='project_template_duster'>" + dusterLabel + "</label>" ;
                        div += "<a href=\"javascript:;\" class=\"help\" onclick=\"simpleDialog('" + dusterDesc + "','" + dusterLabel + "');\">?</a>";
                        div += "</div>" ;
                        div += "<div tabindex=\"-1\" role=\"dialog\" class=\"simpleDialog ui-dialog-content ui-widget-content\">";
                        div += dusterDesc;
                        div += "</div>";

                        $("#project_template_radio0").closest('td').append(div) ;

                        // show DUSTER radio button option if purpose is research
                        $("#purpose").change(function() {
                            $("#purpose").val() == "2" ? $("#duster_option").show() : $("#duster_option").hide() ;
                        }) ;

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

  /**
   * check user is allowed to use DUSTER based on DUSTER's allowlist
   * @return bool
   */
  private function isUserAllowed(): bool {
    $allowlist = $this->getSystemSetting('sunet')[0];
    try {
      $sunet = $this->getUser()->getUsername();
      return in_array($sunet, $allowlist);
    } catch(Exception $e) {
      $this->emError($e);
    }
    return false;
  }

  /**
   * retrieves a valid vertx token via vertx token manager
   * @param $service
   * @return false|mixed
   */
  private function getValidToken($service) {
    $token = false;
    try {
      $tokenMgnt = \ExternalModules\ExternalModules::getModuleInstance('vertx_token_manager');
      $token = $tokenMgnt->findValidToken($service);
    } catch (Exception $ex) {
      $this->emError("Could not find a valid token for service $service");
    }
    return $token;
  }

  /**
   * sends a STARR-API GET request
   * @param $url
   * @param $service
   * @return array|mixed
   */
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

  /**
   * sends a STARR-API POST request
   * @param $url
   * @param $service
   * @param $post_fields
   * @return array|mixed
   */
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

  /**
   * sends a STARR-API GET request to retrieve DUSTER metadata
   * @return array|mixed
   */
  public function getMetadata() {
    $metadata_url = $this->getSystemSetting("starrapi-metadata-url");
    $metadata = $this->starrApiGetRequest($metadata_url,'ddp');
    return $metadata;
  }

    public function test() {
        $resp = $this->starrApiGetRequest("http://host.docker.internal:8889/duster/api/v1/test/",'ddp');
        $this->emDebug('test resp:' . print_r($resp, true));
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
   * Fetch user information from corresponding REDCap API token
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
    $q = $this->createQuery();
    $q->add($sql, [$token]);
    $result = $q->execute();
    $num_results = $q->affected_rows;
    if ($num_results === 1) {
      $row = $result->fetch_assoc();
      return $row['project_id'];
    } else {
      throw new Exception ("Returned $num_results in " . __METHOD__ . " from token '$token'");
    }
  }

  public function handleError($subject, $message, $throwable=null) {
    if (!empty($throwable)) {
        $message .= "<br>Message: ".$throwable->getMessage()."<br>Trace: " .$throwable->getTraceAsString();
    }
    $this->emError("Duster Project Error Subject: $subject; Message: $message");
    $duster_email = $this->getSystemSetting("duster-email");
    if (!empty($duster_email)) {
        $emailStatus = REDCap::email($duster_email,'no-reply@stanford.edu', $subject, $message);
        if (!$emailStatus) {
            $this->emError("Email Notification to $duster_email Failed.  Subject: $subject");
            return "Unable to send notification email to $duster_email.  Please notify your redcap administrator.";
        } else {
            return "An email regarding this issue has been sent to $duster_email.";
        }
    } else {
        $this->emLog("No email configured.");
        return "No duster email has been configured.  Please notify your redcap administrator.";
    }
  }

}
