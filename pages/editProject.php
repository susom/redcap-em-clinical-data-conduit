<?php
namespace Stanford\Duster;
/** @var $module Duster */

use Project;
use REDCap;

require_once $module->getModulePath() . "classes/DusterConfigClass.php";

/**
 * entrypoint to DUSTER's edit project UI (Vue app)
 */
$pid = $module->getProjectId();
$project_status = $module->getProjectStatus($pid);
$user_rights = $module->getUser()->getRights($pid);
$irb = $module->getProjectIrb($pid);
$duster_config_obj = new DusterConfigClass($pid, $module);
$duster_config = json_decode($duster_config_obj->getDusterConfig(), true);
$design_config = $duster_config_obj->getDesignConfig();
$has_design_config = $design_config !== NULL; // PHP 8.3 provides json_validate(), which checks if a string contains valid JSON.
$design_config = json_encode($design_config);
$editable = $project_status === "DEV"
    && strlen($user_rights['api_token']) === 32
    && $user_rights['api_import'] === '1'
    && $user_rights['design'] === '1'
    && $has_design_config === true;

/* Check for non-DUSTER fields */
$project_object = new Project($pid, false);
$existing_forms = $project_object->forms;
$non_duster_fields = [];

// Researcher-Provided Information
if (isset($existing_forms['researcher_provided_information'])) {
    $rp_fields = array_keys($existing_forms['researcher_provided_information']['fields']);
    $duster_rp_fields = ['redcap_record_id', 'mrn'];
    $duster_rp_fields = array_merge($duster_rp_fields, array_keys($duster_config['rp_info']['rp_dates']));
    $duster_rp_fields[] = "researcher_provided_information_complete";
    $non_duster_rp_fields = array_diff($rp_fields, $duster_rp_fields);
    if (!empty($non_duster_rp_fields)) {
        $non_duster_fields[] = [
            'name' => 'researcher_provided_information',
            'label' => 'Researcher-Provided Information',
            'fields' => $non_duster_rp_fields
        ];
    }
    unset($existing_forms['researcher_provided_information']);
}

// Demographics
if (isset($existing_forms['demographics'])) {
    $demographic_fields = array_keys($existing_forms['demographics']['fields']);
    $duster_demographic_fields = array_column($duster_config['demographics'], 'redcap_field_name');
    $duster_demographic_fields[] = "demographics_complete";
    $non_duster_demographic_fields = array_diff($demographic_fields, $duster_demographic_fields);
    if (!empty($non_duster_demographic_fields)) {
        $non_duster_fields[] = [
            'name' => 'demographics',
            'label' => 'Demographics',
            'fields' => $non_duster_demographic_fields
        ];
    }
    unset($existing_forms['demographics']);
}

// Data Collection Windows
foreach ($duster_config['collection_windows'] as $collection_window) {
    $cw_form_name = $collection_window['form_name'];
    if (isset($existing_forms[$cw_form_name])) {
        $cw_fields = array_keys($existing_forms[$cw_form_name]['fields']);
        $timing_fields = [
                $collection_window['timing']['start']['redcap_field_name'],
                $collection_window['timing']['end']['redcap_field_name']
        ];
        if ($collection_window['type'] === 'repeating' && isset($collection_window['timing']['repeat_interval'])) {
            $module->emLog("REPEATING HERE");
            $timing_fields = array_merge($timing_fields, [
                    $cw_form_name,
                    $collection_window['timing']['repeat_interval']['start_instance']['redcap_field_name'],
                    $collection_window['timing']['repeat_interval']['end_instance']['redcap_field_name']
                ]);
        }

        $score_fields = [];
        foreach ($collection_window['data']['scores'] as $score) {
            $score_fields[] = $score['redcap_field_name'];
            foreach ($score['subscores'] as $subscore) {
                $score_fields[] = $subscore['redcap_field_name'];
                $score_fields = array_merge(
                    $score_fields,
                    array_column($subscore['dependencies'], 'redcap_field_name')
                );
            }
        }

        $duster_cw_fields = array_merge(
            $timing_fields,
            array_column($collection_window['event'], 'redcap_field_name'),
            array_column($collection_window['data']['labs'], 'redcap_field_name'),
            array_column($collection_window['data']['vitals'], 'redcap_field_name'),
            array_column($collection_window['data']['outcomes'], 'redcap_field_name'),
            $score_fields
        );
        $duster_cw_fields[] = $cw_form_name . '_complete';

        $non_duster_cw_fields = array_diff($cw_fields, $duster_cw_fields);
        if (!empty($non_duster_cw_fields)) {
            $non_duster_fields[] = [
                'name' => $cw_form_name,
                'label' => $collection_window['label'],
                'fields' => $non_duster_cw_fields
            ];
        }
        unset($existing_forms[$cw_form_name]);
    }
}

// non-DUSTER forms
foreach ($existing_forms as $non_duster_form_name=>$non_duster_form) {
    if (!empty($non_duster_form['fields'])) {
        $non_duster_fields[] = [
            'name' => $non_duster_form_name,
            'label' => $non_duster_form['menu'],
            'fields' => array_keys($non_duster_form['fields'])
        ];
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<h3>
    DUSTER: Edit Project
</h3>
<?php
 if ($editable === true) {
?>
    <p>Hitting the button below will launch an application where you may perform the following modifications to your project:</p>
    <ol>
      <li>Add new Researcher-Provided Information.</li>
      <li>Select additional demographics.</li>
      <li>Add new data collection windows.</li>
      <li>Add new clinical variables to pre-existing data collection windows.</li>
      <!-- <li>Select additional aggregations to pre-existing clinical variables in data collection windows.</li> -->
    </ol>
    <?php
     if (!empty($non_duster_fields)) {
    ?>
        <h1 style="color:red">
            WARNING: This REDCap project contains non-DUSTER REDCap fields/forms.
        </h1>
        <h2 style="color:red">
            The following non-DUSTER REDCap fields may be lost if you decide to edit this DUSTER project:
        </h2>
         <strong>
        <?php foreach ($non_duster_fields as $form): ?>
            <ol>
                <?= $form['label']; ?> (<?= $form['name']; ?>)
                <?php foreach ($form['fields'] as $field_name): ?>
                 <li><?= $field_name; ?></li>
                <?php endforeach; ?>
            </ol>
        <?php endforeach; ?>
         </strong>
    <?php
     }
    ?>

    <button
      type="button"
      onclick="window.location = '<?php echo $module->getUrl("pages/js/duster/new-project/dist/index.html"); ?>';"
    >Launch Editor
    </button>

<?php
 } else if ($has_design_config === false) {
    ?>
    <strong>
        Sorry, you cannot edit this DUSTER project. This project was created before the editing feature was released and cannot be retroactively supported.
    </strong>
<?php
} else {
?>
    <strong>
        Sorry, you cannot edit this DUSTER project.
    </strong>
    <p>
        In order to edit this DUSTER project, the following conditions are required:
    </p>
    <ol>
        <li>This REDCap project must be in Development mode.</li>
        <li>You must have Project Design and Setup privileges in this REDCap project.</li>
        <li>You must have API Import privileges in this REDCap project.</li>
        <li>You must have an API Token for this REDCap project.</li>
    </ol>
<?php
}
?>
</html>

<!-- axios CDN -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
    setInterval(() => {
    axios.get("<?php echo $module->getUrl("services/refreshSession.php"); ?>")
        .then(function (response) {

        })
        .catch(function (error) {

        });
    },60000);

    const editable = <?php echo $editable; ?> ? true:false;
    if (editable === true) {
        localStorage.removeItem('postObj');
        let postObj = {};
        postObj['redcap_csrf_token'] = "<?php echo $module->getCSRFToken(); ?>";
        postObj['redcap_user'] = "<?php echo $module->getUser()->getUserName(); ?>";
        postObj['edit_mode'] = true;
        postObj['redcap_project_id'] = "<?php echo $pid; ?>";
        postObj['project_irb_number'] = "<?php echo $irb; ?>";
        postObj['initial_design'] = <?php echo $design_config; ?>;

        // store URL for REDCap's 'New Project' page
        postObj['redcap_new_project_url'] = "<?php echo APP_PATH_WEBROOT_FULL . "index.php?action=create"; ?>";
        // store URL for services/reportFatalError.php
        postObj['report_fatal_error_url'] = "<?php echo $module->getUrl("services/reportFatalError.php"); ?>";
        // store URL for services/checkIRB.php
        postObj['check_irb_url'] = "<?php echo $module->getUrl("services/checkIRB.php"); ?>";
        // store URL for services/callMetadata.php
        postObj['metadata_url'] = "<?php echo $module->getUrl("services/callMetadata.php"); ?>";
        // store URL for services/getDatasetDesigns.php
        postObj['get_dataset_designs_url'] = "<?php echo $module->getUrl("services/getDatasetDesigns.php"); ?>";
        // store URL for services/refreshSession.php
        postObj['refresh_session_url'] = "<?php echo $module->getUrl("services/refreshSession.php"); ?>";
        // store URL for services/updateProject.php
        postObj['update_project_url'] = "<?php echo $module->getUrl("services/updateProject.php"); ?>";
        // store DPA URLs
        postObj['new_dpa_url'] = 'https://redcap.stanford.edu/surveys/?s=L3TRTT9EF9';
        postObj['addon_dpa_url'] = 'https://redcap.stanford.edu/surveys/?s=8RWF73YTWA'
        postObj['add_dpa_to_irb_url'] = 'https://med.stanford.edu/starr-tools/data-compliance/modify-existing-protocol.html';
        localStorage.setItem('postObj', JSON.stringify(postObj));
    }
</script>
