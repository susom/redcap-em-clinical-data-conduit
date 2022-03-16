<?php
namespace Stanford\Duster;

require_once "emLoggerTrait.php";

class Duster extends \ExternalModules\AbstractExternalModule {

    use emLoggerTrait;

    public function __construct() {
		parent::__construct();
		// Other code to run when object is instantiated
	}


    // TODO - modify to get user-entered project title, purpose, and notes (POST request to newProject.php?)
    // public function redcap_every_page_top($project_id) {
    public function redcap_every_page_top() {
        // $this->emDebug("In Every Page Top Hook project id :" . $project_id . " Page is " . PAGE);
        if (PAGE === "index.php" && $_GET['action'] === 'create') {
            $some = "<script> var dusterUrl = '" . $this->getUrl("pages/newProjectIntro.php", false, true) . "' ; </script>";
            echo $some;

            $script = <<<EOD
                <script>
                    $(document).ready(function() {
                        var div = "<div style='text-indent: -1.5em; margin-left: 1.5em;'><input name='project_template_radio' id='project_template_duster' type='radio'>" ;
                        div += "<label style='text-indent:3px;margin-top:4px;margin-bottom:0;cursor:pointer;' for='project_template_duster'>Create project using DUSTER</label>" ;
                        div += "</div>" ;
                        $("#project_template_radio0").closest('td').append(div) ;

                        var btn = '<button type="button" class="btn btn-primaryrc" id="dusterSubmitBtn">Create Project</button>' ;
                        var defaultCreateBtn = $("button.btn-primaryrc").hide() ;
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

	public function redcap_module_system_enable( $version ) {

	}


	public function redcap_module_project_enable( $version, $project_id ) {

	}


	public function redcap_module_save_configuration( $project_id ) {

	}


}
