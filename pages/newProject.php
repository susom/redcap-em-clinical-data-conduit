<?php
namespace Stanford\Duster;
/** @var $module Duster */
?>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/ico" href="data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wDa2vAkgYHMtWxsxJPw8PkM////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCiotpaCgqd8z8/sv8AAJn/ICCl3szM6jH///8A////AP///wD///8A////AP///wD///8A////AP///wCGhs53AACZ/wAAmf8/P7L/AACZ/wAAmf8KCp31vLzkQf///wD///8A////AP///wD///8A////AP///wCiotpaISGm/S8vrP8vL6z/Pz+y/wAAmf8AAJn/Cwud/xsbo/DU1O4p////AP///wD///8A////AP///wDe3vIfDAyd83xwy/+kjtz/wrPn/z8/sv8AAJn/AACZ/1pavf9ISLb/MDCsz/r6/QP///8A////AP///wD///8AWFi8pk5MuP+biNj/jG/S/5uD2P8/P7L/AACZ/wAAmf9FRbT/mprW/wwMnf+YmNZl////AP///wD///8A4ODyHQQEmvxmZML/tKLi/7yr5f93dcj/Pz+y/wAAmf8QEJ//nZ3Y/3Z2yP8AAJn/Jiao2f///wD///8A////AIqK0HIAAJn/VFK7/2tTxf+Xidb/Jiao/z8/sv8AAJn/Jiao/6ys3v8wMKz/AACZ/wAAmf/Kyuoy////AP///wBiYr+1ICCl/yAgpf8gIKX/ICCl/yAgpf9XV7z/AACZ/wAAmf9KSrb/k5PU/ywsqv8AAJn/iIjPdf///wD///8AQkKz4jMzrf9SUrr/d3fJ/0lJtv8vL6z/Y2PA/wAAmf8AAJn/PDyx/2NjwP9nZ8L/AACZ/1xcvaH///8A////AAUFmv1kZMH/ysrp/9XV7v+2tuH/NDSu/z8/sv8AAJn/AACZ/29vxf+np9v/BASa/wAAmf9CQrO9////AP///wAGBpv/m5vX/4eHz//u7vj/Tk64/5eX1f8/P7L/AACZ/ywsqv+qqt3/QECy/wAAmf8AAJn/QECyv////wD///8AAgKZ/QAAmf9ra8T/3d3x/ykpqf8CApn/Pz+y/wcHm/+JidD/MDCs/1dXvP8AAJn/AACZ/0BAsr3///8A////ABgYouUAAJn/Wlq9/9/f8v8XF6L/AACZ/z8/sv8UFKH/kZHT/6el3P9iYsD/AACZ/wAAmf9YWLym////AP///wBCQrO9AACZ/yMjp/+vr9//BASa/wAAmf8/P7L/AACZ/wAAmf8ICJz/AACZ/wAAmf8AAJn/goLNff///wD///8Ajo7ScCAgpd4gIKXeS0u33iAgpd4gIKXeV1e73iAgpd4gIKXeICCl3iAgpd4gIKXeICCl3sbG6Dj///8A/n8AAPw/AAD4HwAA8A8AAOAHAADABwAAwAMAAMADAACAAwAAgAEAAIABAACAAQAAgAEAAIABAACAAwAAwAMAAA=="/>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <style>
        .margin10 { margin-bottom: 10cm;}
        .margin2 { margin-bottom: 2cm;}
        .tb {border: 1px solid lightgrey;}
        .auto-width {width: auto;}
        h5 {color: rgba(49, 108, 244, 0.99);}
        th, td {
            padding-left: 15px;
            padding-right: 15px;
        }
        .screenshot, table.tb > tbody > tr > td {
            border: 1px solid lightgrey;
            padding: 15px;}
        thead > tr > td {font-weight: bold;}
    </style>
    <title>DUSTER: Step 1 of 4</title>
</head>
<body>
    <div class="container">
        <form method="post" id="project-info-form">
            <!-- form data initially entered by user on initial create new project page (/index.php?action=create) -->
            <?php
            foreach($_POST as $name=>$value) {
                $value = is_array($value) ? implode(",", $value) : $value;
                echo "<input type=\"hidden\" name=\"$name\" value=\"$value\">";
            }
            echo "<input type=\"hidden\" name=\"redcap_csrf_token\"value=\"{$module->getCSRFToken()}\">";
            ?>

<!--
            <input type="hidden" name="surveys_enabled" value=<?php //echo $_POST["surveys_enabled"] ?>>
            <input type="hidden" name="repeatforms" value=<?php //echo $_POST["repeatforms"] ?>>
            <input type="hidden" name="scheduling" value=<?php //echo $_POST["scheduling"] ?>>
            <input type="hidden" name="randomization" value=<?php //echo $_POST["randomization"] ?>>
            <input type="hidden" name="app_title" value=<?php //echo $_POST["app_title"] ?>>
            <input type="hidden" name="purpose" value=<?php //echo $_POST["purpose"] ?>>
            <input type="hidden" name="project_pi_firstname" value=<?php //echo $_POST["project_pi_firstname"] ?>>
            <input type="hidden" name="project_pi_mi" value=<?php //echo $_POST["project_pi_mi"] ?>>
            <input type="hidden" name="project_pi_lastname" value=<?php //echo $_POST["project_pi_lastname"] ?>>
            <input type="hidden" name="project_pi_email" value=<?php //echo $_POST["project_pi_email"] ?>>
            <input type="hidden" name="project_pi_alias" value=<?php //echo $_POST["project_pi_alias"] ?>>
            <input type="hidden" name="project_irb_number" value=<?php //echo $_POST["project_irb_number"] ?>>
            <input type="hidden" name="purpose_other" value=<?php //echo $_POST["purpose_other"] ?>>
            <input type="hidden" name="project_note" value=<?php //echo $_POST["project_note"] ?>>
            <input type="hidden" name="projecttype" value=<?php //echo $_POST["projecttype"] ?>>
            <input type="hidden" name="repeatforms_chk" value=<?php //echo $_POST["repeatforms_chk"] ?>>
            <input type="hidden" name="project_template_radio" value=<?php //echo $_POST["project_template_radio"] ?>>
            <input type="hidden" name="redcap_csrf_token" value=<?php //echo $_POST["redcap_csrf_token"] ?>>
-->

        </form>

        <form method="post" id="duster-form">

            <?php
            foreach($_POST as $name=>$value) {
                echo "<input type=\"hidden\" name=\"$name\" value=\"$value\">";
            }
            echo "<input type=\"hidden\" name=\"redcap_csrf_token\"value=\"{$module->getCSRFToken()}\">";
            ?>

            <div class="row justify-content-start">
                <div class="col-12"><h1>DUSTER</h1><h4>Data Upload Service for Translational rEsearch on Redcap</h4></div>
            </div>

            <div class="steps">
                <div id="step-0" class="step">
                    Loading metadata. Please wait...
                </div>
                <div id="step-1" class="step" style="display:none">
                    <div class="row justify-content-start">
                        <div class="col-10">
                            <h5 id="header-step-1">Step 1 of 4: Your Clinical Focus</h5>
                        </div>
                    </div>
                    <div>
                        <p>Which of the following clinical care venues are relevant to your study</p>
                        <table>
                            <thead>
                            <tr><td colspan="2">Clinical Care Venue</td></tr></thead>
                            <tbody>
                            <tr>
                                <td><input class="input-venue" type="checkbox" value="outpatient" id="venue-outpatient"></td>
                                <td>
                                    Outpatient
                                </td>
                            </tr><tr>
                                <td><input class="input-venue" type="checkbox" value="ed" id="venue-ed"></td>
                                <td>
                                    ED
                                </td>
                            </tr><tr>
                                <td><input class="input-venue" type="checkbox" value="inpatient" id="venue-inpatient"></td>
                                <td>
                                    Inpatient
                                </td>
                            </tr><tr>
                                <td><input class="input-venue" type="checkbox" value="icu" id="venue-icu"></td>
                                <td>
                                    ICU
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <p></p>
                        <p>Your selections on this page will be used to filter out irrelevant options later in the setup process.</p>
                    </div>
                    <div>
                        <p>
                            Next we will walk you through the process of selecting the variables of interest
                            to your study, starting with patient-related information
                        </p>
                    </div>
                    <div class="margin10"></div>
                    <button type="button" onclick="goToStep(1)" class="btn btn-primary">< Back</button>
                    <button type="button" onclick="goToStep(2)" class="btn btn-primary" id="step1-next" disabled>Next ></button>
                    <button type="button" onclick="reviewStep()" class="btn btn-primary" id="step1-review" disabled>Review</button>
                    <label id="select-venue-msg"> At least one Clinical Care Venue must be selected to continue.</label>
                </div>
                <div id="step-2" class="step" style="display:none">
                    <div class="row justify-content-start">
                        <div class="col-10">
                            <h5 id="header-step-2">Step 2 of 4: Demographics and Outcomes</h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-10">
                            <p>
                                Please make your selections below for demographics and outcomes.
                            </p>
                            <p>
                                You will be to confirm your selections at the review step.
                            </p>
                            <table>
                                <thead>
                                    <tr>Demographics</tr>
                                    <tr><td><input class="input-demographics" type="checkbox" value="" id="demo"  onclick="toggleCb(this)"></td><td>Clinical Variable</td></tr></thead>
                                </thead>
                                <tbody id="tbody-step2-demographics">
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>Outcomes</tr>
                                    <tr><td><input class="input-outcomes" type="checkbox" value="" id="demo"  onclick="toggleCb(this)"></td><td>Clinical Variable</td></tr></thead>
                                </thead>
                                <tbody id="tbody-step2-outcomes">
                                </tbody>
                            </table>
                            <p></p>
                            <div class="margin2"></div>
                            <div class="margin2"></div>
                        </div>
                    </div>
                    <button type="button" onclick="goToStep(1)" class="btn btn-primary">< Back</button>
                    <button type="button" onclick="reviewStep()" class="btn btn-primary">Review</button>
                </div>
                <div id="step-review" class="step" style="display:none">
                    <div class="row justify-content-start">
                        <div class="col-10">
                            <h5 id="header-step-review">Review Design</h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <p>
                                REDCap Project Title:
                            </p>
                        </div>
                        <div class="col-4">
                            <p>
                                <?php echo $_POST["app_title"] ?>
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <p>
                                Designated Clinical Date:
                            </p>
                        </div>
                        <div class="col-4">
                            <p>
                                <select class="form-select" aria-label="Default select example">
                                    <option selected value="date_enrolled">Enrollment Date</option>
                                    <option value="date_visit">Visit Date</option>
                                </select>
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-10">
                            <p>
                                Displayed below are your chosen clinical variables. Feel free to return to previous steps to change your selections.
                            </p>
                            <table>
                                <thead>
                                <tr>
                                    Demographics
                                </tr>
                                <tr>
                                    <td>Clinical Variable</td>
                                    <td>REDCap Variable Name</td>
                                </tr>
                                </thead>
                                <tbody id="review-demographics">
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                <tr>
                                    Outcomes
                                </tr>
                                <tr>
                                    <td>Clinical Variable</td>
                                    <td>REDCap Variable Name</td>
                                </tr>
                                </thead>
                                <tbody id="review-outcomes">
                                </tbody>
                            </table>
                            <p></p>
                            <div class="margin2"></div>
                            <div class="margin2"></div>
                        </div>
                    </div>
                    <button type="button" onclick="goToStep(2)" class="btn btn-primary">< Back</button>
                    <button type="button" onclick="createProject()" class="btn btn-primary">Create Project</button>
                </div>
                <div id="step-create" class="step" style="display:none">
                    You will be taken to your new project after it's created. Please wait...
                </div>
                <!--
                <div id="step-finished" class="step" style="display:none">
                    <a id="new-project-link">
                        <button type="button" class="btn btn-primary">Go to project</button>
                    </a>
                </div>
                -->
            </div>

            <div id="step3a" class="step" style="display:none">
                <div class="row justify-content-start">
                    <div class="col-10">
                        <h5>Step 3 of 4: Time Frame & Selectors for Data Capture</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-10">
                        <p>Clinical data always has an associated date and almost always also has an associated time of day.</p>
                        </p><p>
                        Furthermore there can be many data points of a given type over time.
                        This means you need to specify which of the many possible items (e.g. the first, the highest, etc.) you want to collect for your research.</p>
                        <p>To simplify configuration, DUSTER requires that the data collection time frame duration and temporal selectors
                            are consistent for all variables in the project.</p>
                        <p>If your study design does not fit this policy, you can always use this tool to create a starting point
                            then use the REDCap DDP designer to further customize your project.</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p>
                        <table><thead><td><input class='form-check-input' type='checkbox' value='' id='lab_temp' onClick="toggleCb(this);"></td><td colspan="2">Recurring Result Selector</td><td>Field name prefix</td><td></td></thead>
                            <tbody>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='first'></td><td>First</td><td></td><td>first_</td>

                            </tr>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='highest'></td><td colspan="2">Highest / Maximum</td><td>max_</td></tr>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='lowest'></td><td colspan="2">Lowest / Minimum</td><td>min_</td></tr>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='last'></td><td>Last</td></td><td><td>last_</td></tr>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='closest'></td><td>Closest to </td><td><select class="form-select" aria-label="Time frame start">
                                <option value="12am">midnight</option>
                                <option value="8am">8am</option>
                                <option value="12pm">noon</option>
                                <option value="4pm">4pm</option>
                                <option value="8pm">8pm</option>
                            </select>
                            </td><td>close_</td></tr>
                            <tr><td><input class='form-check-input lab_temp' type='checkbox' value='' id='first_after'></td><td>First after </td><td><select class="form-select" aria-label="Time frame start">
                                <option value="12am">midnight</option>
                                <option value="8am">8am</option>
                                <option value="12pm">noon</option>
                                <option value="4pm">4pm</option>
                                <option value="8pm">8pm</option>
                            </select></td><td>first_</td></tr>
                            </tbody>
                        </table></p>
                        <p>
                        </p>
                    </div>
                    <div class="col-6">
                        <p><img height="200" src=<?php echo $module->getUrl("images/timeframe.png"); ?>/></p>
                    </div>
                    <div class="col-5">
                        <table><tbody><tr><td>Time frame start</td><td> <select class="form-select" aria-label="Time frame start">
                            <option selected value="date_enrolled">Enrollment Date (date_enrolled)</option>
                            <option value="date_ed_admit">ED Admission (date_ed_admit)</option>
                            <option value="date_ed_discharge">ED Discharge (date_ed_discharge)</option>
                            <option value="date_icu_admit">ICU Admission (date_icu_admit)</option>
                            <option value="date_icu_discharge">ICU Discharge (date_icu_discharge)</option>
                        </select>
                        </td>
                        </tr>
                        </tbody>
                        </table>

                    </div>
                    <div class="col-5">
                        <table><tbody><tr><td>Time frame duration</td>
                            <td  style='width:80px'><input class="form-control "  type="text"  id="timeframe_duration"></td>
                            <td><select class="form-select auto-width " aria-label="Interval Selector"  id="timeframe_duration_units">
                                <option selected value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select></td>
                        </tr></tbody></table>
                    </div>
                    <div class="col-10">
                        <p></p>
                        <table><tbody><tr><td> <input class='form-check-input' type='checkbox' value='' id='repeat' onClick="toggleFormFields(this);"></td>
                            <td >Repeat</td>
                            <td style='width:80px' class="repeat d-none"><input class="form-control "  type="text"  id="repeat_n_times"></td>
                            <td class="repeat d-none">times</td>
                        </tr></tbody></table>
                    </div>
                    <div class="col-12">
                        <div class="margin2"></div>
                        <div class="margin2"></div>
                        <div onclick="goToStep(2)" class="btn btn-primary">< Back</div>
                        <div onclick="goToStep(4)" class="btn btn-primary">Next ></div>
                    </div>
                </div>
            </div>
            <div id="step4" class="step" style="display:none">
                <div class="row justify-content-start">
                    <div class="col-10">
                        <h5>Step 4 of 4: Clinical Data Types</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p></p>
                        <img src="<?php echo $module->getUrl("images/tab_pointer.png"); ?>" height="40"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page"  id="labs" onclick="tabTo('labs')">Lab Results</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="vitals"  onclick="tabTo('vitals')">Vitals Results</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="vent"  onclick="tabTo('vent')">Vent Results</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="vent_outcomes"  onclick="tabTo('vent_out')">Vent Outcomes</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="meds" onclick="tabTo('meds')">Medications</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="blood" onclick="tabTo('blood')">Blood Products</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="io"  onclick="tabTo('io')">I/O</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link " id="scores" onclick="tabTo('scores')">Scores</a>
                            </li>
                        </ul>
                    </div>

                    <div class="scores row d-none tab">
                        <div class="col-12">
                            <p></p>
                            <p>
                                DUSTER is able to pull most but not all the required variables to calculate the Apache II and SOFA scores.
                                If you select one of the options below, DUSTER will add a set of variables including several that
                                you will need to manually enter data for after chart review before the score can be calculated.
                            </p>

                            <p>Each score is accompanied by a set of associated fields required to calculate the score. Note the companion fields all have the same prefix and suffix as the score field.
                                The field names in this table are used as suffixes for the final field names, determined in Step 4.</p>
                            <table><thead><td>Include?</td><td>Score</td><td>Final Score Field Name</td><td>Companion Fields Requiring Chart Review</td> <td>Auto-populated Companion Fields </td></thead><tbody>
                            <tr>
                                <td><input class="form-check-input" type="checkbox" value="" id="apache2_score_dstr"></td><td>
                                Apache II</td><td>apache_2_score_dstr</td><td>apache_2_organ_fail_dstr, apache_2_renal_fail_dstr, glasgow_coma_dstr </td><td>apache_2_age_dstr, apache_2_temp_dstr, mort_risk_map_dstr, apache_2_ph_dstr, apache_2_pulse_dstr,  apache_2_rr_dstr, apache_2_na_dstr, apache_2_k_dstr, mort_risk_creat_dstr, apache_2_hct_dstr, apache_2_wbc_dstr, apache_2_fio2_dstr</td>
                            </tr>
                            <tr>
                                <td><input class="form-check-input" type="checkbox" value="" id="sofa_score_dstr"></td><td>
                                SOFA</td><td>sofa_score_dstr</td><td>sofa_mechanical_vent_dstr</td><td>sofa_pao2_dstr, sofa_fio2_dstr, sofa_plt_dstr, glasgow_coma_dstr, mort_risk_map_dstr, mort_risk_creat_dstr</td>
                            </tr>
                            </tbody></table>
                            <p></p>
                        </div>
                    </div>

                    <div class="labs row  tab">
                        <div class="col-12">
                            <p></p>
                            <p>The following lab results will be selected: <strong>First, Last, Closest to 8am</strong>. You can adjust these selections on the previous page</p>
                            <p>Field suffixes will be composed of the temporal field selectors chosen
                                on the previous page prepended to the suffixes selected below, e.g. first_serum_glucose_dstr</p>
                            <p><strong>Lab Result Types</strong>
                            <table><thead><td><input class='form-check-input' type='checkbox' value='' id='lab' onClick="toggleCb(this);"></td><td>Lab Result</td><td>Field name suffix</td><td>Include?</td><td>Lab Result</td><td>Field name suffix</td></thead><tbody>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_glucose_dstr'></td><td>Serum Glucose</td><td>serum_glucose_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='hemoglobin_dstr'></td><td>Hemoglobin</td><td>hemoglobin_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_potassium_dstr'></td><td>Serum Potassium</td><td>serum_potassium_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_creatinine_dstr'></td><td>Serum Creatinine</td><td>serum_creatinine_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_bun_dstr'></td><td>Serum BUN</td><td>serum_bun_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='hematocrit_dstr'></td><td>Hematocrit</td><td>hematocrit_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_platelet_count_dstr'></td><td>Blood Platelet Count</td><td>blood_platelet_count_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='blood_mcv_dstr'></td><td>Blood MCV</td><td>blood_mcv_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_rbc_dstr'></td><td>Blood RBC</td><td>blood_rbc_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='blood_rdw_dstr'></td><td>Blood RDW</td><td>blood_rdw_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_wbc_dstr'></td><td>Blood WBC</td><td>blood_wbc_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_hco3_dstr'></td><td>Serum HCO3</td><td>serum_hco3_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='anion_gap-arterial_dstr'></td><td>Anion Gap-Arterial</td><td>anion_gap-arterial_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='base_excess_dstr'></td><td>Base Excess</td><td>base_excess_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_neutrophils_no_dstr'></td><td>Blood Neutrophils No</td><td>blood_neutrophils_no_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_magnesium_dstr'></td><td>Serum Magnesium</td><td>serum_magnesium_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='po2-arterial_dstr'></td><td>pO2-Arterial</td><td>po2-arterial_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='pco2-arterial_dstr'></td><td>pCO2-Arterial</td><td>pco2-arterial_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='ph-arterial_dstr'></td><td>pH-Arterial</td><td>ph-arterial_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_phosphorus_dstr'></td><td>Serum Phosphorus</td><td>serum_phosphorus_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='so2-arterial_dstr'></td><td>SO2-Arterial</td><td>so2-arterial_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_calcium_ionized_dstr'></td><td>Serum Calcium Ionized</td><td>serum_calcium_ionized_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='inr_dstr'></td><td>INR</td><td>inr_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_lactate_dstr'></td><td>Serum Lactate</td><td>serum_lactate_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='ptt_dstr'></td><td>PTT</td><td>ptt_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_bilirubin-total_dstr'></td><td>Serum Bilirubin-Total</td><td>serum_bilirubin-total_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_alt_dstr'></td><td>Serum ALT</td><td>serum_alt_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_ast_dstr'></td><td>Serum AST</td><td>serum_ast_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_lymphocytes_pct_dstr'></td><td>Blood Lymphocytes pct</td><td>blood_lymphocytes_pct_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='pco2-venous_dstr'></td><td>pCO2-Venous</td><td>pco2-venous_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='po2-venous_dstr'></td><td>pO2-Venous</td><td>po2-venous_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='ph-venous_dstr'></td><td>pH-Venous</td><td>ph-venous_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_band_%_dstr'></td><td>Blood Band %</td><td>blood_band_%_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_bilirubin-direct_dstr'></td><td>Serum Bilirubin-Direct</td><td>serum_bilirubin-direct_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='troponin_t_dstr'></td><td>Troponin T</td><td>troponin_t_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='rbc_dstr'></td><td>RBC</td><td>rbc_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_osmolality_dstr'></td><td>Serum Osmolality</td><td>serum_osmolality_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_albumin_dstr'></td><td>Serum Albumin</td><td>serum_albumin_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_ck_dstr'></td><td>Serum CK</td><td>serum_ck_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='plasma_fibrinogen_dstr'></td><td>Plasma Fibrinogen</td><td>plasma_fibrinogen_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_ammonia_dstr'></td><td>Serum Ammonia</td><td>serum_ammonia_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_ldh_dstr'></td><td>Serum LDH</td><td>serum_ldh_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='blood_neutrophils_pct_dstr'></td><td>Blood Neutrophils pct</td><td>blood_neutrophils_pct_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_lipase_dstr'></td><td>Serum Lipase</td><td>serum_lipase_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_protein_dstr'></td><td>Serum Protein</td><td>serum_protein_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='crp_dstr'></td><td>CRP</td><td>crp_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='bnp_dstr'></td><td>BNP</td><td>bnp_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='blood_reticulocytes_pct_dstr'></td><td>Blood Reticulocytes pct</td><td>blood_reticulocytes_pct_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='hba1c_dstr'></td><td>HbA1C</td><td>hba1c_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='serum_ferritin_dstr'></td><td>Serum Ferritin</td><td>serum_ferritin_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='serum_ggt_dstr'></td><td>Serum GGT</td><td>serum_ggt_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='svo2_dstr'></td><td>SvO2</td><td>svo2_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='fibrin_degradation_products_dstr'></td><td>Fibrin Degradation Products</td><td>fibrin_degradation_products_dstr</td>
                                <td><input class='form-check-input lab' type='checkbox' value='' id='d-dimer_dstr'></td><td>D-Dimer</td><td>d-dimer_dstr</td></tr>
                            <tr><td><input class='form-check-input lab' type='checkbox' value='' id='troponin_i_dstr'></td><td>Troponin I</td><td>troponin_i_dstr</td></tr>
                            </tbody></table></p>
                        </div>
                    </div>

                    <div class="meds row d-none tab">
                        <div class="col-12">
                            <p></p>
                            <p>DUSTER will calculate the total dose of each selected medication for the timespan specified on the previous page.</p>
                            <p>The field names in this table are used as suffixes for the final field names.</p>
                            <table><thead><td><input class='form-check-input' type='checkbox' value='' id='med' onClick="toggleCb(this);"></td><td>Medication</td><td>Field name suffix</td></thead><tbody>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='saline_0.9pct_dstr'></td><td>Saline 0.9%</td><td>saline_0.9pct_dstr</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='lactated_ringers'></td><td>Lactated Ringers</td><td>lactated_ringers</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='saline_0.45pct_dstr'></td><td>Saline 0.45%</td><td>saline_0.45pct_dstr</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='insulin'></td><td>Insulin</td><td>insulin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='fentanyl'></td><td>Fentanyl</td><td>fentanyl</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='heparin'></td><td>Heparin</td><td>heparin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='albumin_5pct_dstr'></td><td>Albumin 5%</td><td>albumin_5pct_dstr</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='albuterol_/_ipratropium_bromide'></td><td>Albuterol / Ipratropium bromide</td><td>albuterol_/_ipratropium_bromide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='piperacillin/tazobactam'></td><td>Piperacillin/Tazobactam</td><td>piperacillin/tazobactam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='vancomycin'></td><td>Vancomycin</td><td>vancomycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='metoprolol'></td><td>Metoprolol</td><td>metoprolol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='metronidazole'></td><td>Metronidazole</td><td>metronidazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='albumin_25pct_dstr'></td><td>Albumin 25%</td><td>albumin_25pct_dstr</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='hydrocortisone'></td><td>Hydrocortisone</td><td>hydrocortisone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='pantoprazole'></td><td>Pantoprazole</td><td>pantoprazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='furosemide'></td><td>Furosemide</td><td>furosemide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='midazolam'></td><td>Midazolam</td><td>midazolam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='lorazepam'></td><td>Lorazepam</td><td>lorazepam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='cefepime'></td><td>Cefepime</td><td>cefepime</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='phenylephrine'></td><td>Phenylephrine</td><td>phenylephrine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='levofloxacin'></td><td>Levofloxacin</td><td>levofloxacin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='meropenem'></td><td>Meropenem</td><td>meropenem</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='d5w'></td><td>D5W</td><td>d5w</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='propofol'></td><td>Propofol</td><td>propofol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='norepinephrine'></td><td>Norepinephrine</td><td>norepinephrine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='methylprednisolone'></td><td>Methylprednisolone</td><td>methylprednisolone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='magnesium_sulfate'></td><td>Magnesium Sulfate</td><td>magnesium_sulfate</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='lansoprazole'></td><td>Lansoprazole</td><td>lansoprazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='aspirin'></td><td>Aspirin</td><td>aspirin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='sodium_phosphate'></td><td>Sodium Phosphate</td><td>sodium_phosphate</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='vasopressin'></td><td>Vasopressin</td><td>vasopressin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='serum_alk_phos'></td><td>Serum Alk Phos</td><td>serum_alk_phos</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ciprofloxacin'></td><td>Ciprofloxacin</td><td>ciprofloxacin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='calcium'></td><td>Calcium</td><td>calcium</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='omeprazole'></td><td>Omeprazole</td><td>omeprazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ceftriaxone'></td><td>Ceftriaxone</td><td>ceftriaxone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ketamine'></td><td>Ketamine</td><td>ketamine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='d50w'></td><td>D50W</td><td>d50w</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='etomidate'></td><td>Etomidate</td><td>etomidate</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='amiodarone'></td><td>Amiodarone</td><td>amiodarone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='morphine'></td><td>Morphine</td><td>morphine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='succinylcholine'></td><td>Succinylcholine</td><td>succinylcholine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='oseltamivir'></td><td>Oseltamivir</td><td>oseltamivir</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='rocuronium'></td><td>Rocuronium</td><td>rocuronium</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='acyclovir'></td><td>Acyclovir</td><td>acyclovir</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='epinephrine'></td><td>Epinephrine</td><td>epinephrine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='octreotide'></td><td>Octreotide</td><td>octreotide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='levetiracetam'></td><td>Levetiracetam</td><td>levetiracetam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='labetalol'></td><td>Labetalol</td><td>labetalol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ampicillin'></td><td>Ampicillin</td><td>ampicillin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='lidocaine'></td><td>Lidocaine</td><td>lidocaine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='amlodipine'></td><td>Amlodipine</td><td>amlodipine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='acetylcysteine'></td><td>Acetylcysteine</td><td>acetylcysteine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='saline_3pct_dstr'></td><td>Saline 3%</td><td>saline_3pct_dstr</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='carvedilol'></td><td>Carvedilol</td><td>carvedilol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='hydralazine'></td><td>Hydralazine</td><td>hydralazine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='aztreonam'></td><td>Aztreonam</td><td>aztreonam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='warfarin'></td><td>Warfarin</td><td>warfarin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='dexmedetomidine'></td><td>Dexmedetomidine</td><td>dexmedetomidine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='vecuronium'></td><td>Vecuronium</td><td>vecuronium</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='clindamycin'></td><td>Clindamycin</td><td>clindamycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='glucagon'></td><td>Glucagon</td><td>glucagon</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='cefazolin'></td><td>Cefazolin</td><td>cefazolin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='dexamethasone'></td><td>Dexamethasone</td><td>dexamethasone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='lisinopril'></td><td>Lisinopril</td><td>lisinopril</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='nafcillin'></td><td>Nafcillin</td><td>nafcillin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='terlipressin'></td><td>Terlipressin</td><td>terlipressin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='azithromycin'></td><td>Azithromycin</td><td>azithromycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='linezolid'></td><td>Linezolid</td><td>linezolid</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='clonazepam'></td><td>Clonazepam</td><td>clonazepam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='clonidine'></td><td>Clonidine</td><td>clonidine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='tobramycin'></td><td>Tobramycin</td><td>tobramycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='caspofungin'></td><td>Caspofungin</td><td>caspofungin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='fluconazole'></td><td>Fluconazole</td><td>fluconazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='enoxaparin'></td><td>Enoxaparin</td><td>enoxaparin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='d5_0.45pct_dstr_nacl'></td><td>D5 0.45% NaCl</td><td>d5_0.45pct_dstr_nacl</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='voriconazole'></td><td>Voriconazole</td><td>voriconazole</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='isoproterenol'></td><td>Isoproterenol</td><td>isoproterenol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='metolazone'></td><td>Metolazone</td><td>metolazone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='atracurium'></td><td>Atracurium</td><td>atracurium</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ampicillin/sulbactam'></td><td>Ampicillin/Sulbactam</td><td>ampicillin/sulbactam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ceftazidime'></td><td>Ceftazidime</td><td>ceftazidime</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='acetazolamide'></td><td>Acetazolamide</td><td>acetazolamide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='rifampin'></td><td>Rifampin</td><td>rifampin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='nitroglycerin'></td><td>Nitroglycerin</td><td>nitroglycerin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='erythromycin'></td><td>Erythromycin</td><td>erythromycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='tpa'></td><td>TPA</td><td>tpa</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='dobutamine'></td><td>Dobutamine</td><td>dobutamine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='spironolactone'></td><td>Spironolactone</td><td>spironolactone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='phenytoin'></td><td>Phenytoin</td><td>phenytoin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ticarcillin/clavulanate'></td><td>Ticarcillin/Clavulanate</td><td>ticarcillin/clavulanate</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='diazepam'></td><td>Diazepam</td><td>diazepam</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='esmolol'></td><td>Esmolol</td><td>esmolol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='gentamicin'></td><td>Gentamicin</td><td>gentamicin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='atenolol'></td><td>Atenolol</td><td>atenolol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='amoxicillin'></td><td>Amoxicillin</td><td>amoxicillin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='propranolol'></td><td>Propranolol</td><td>propranolol</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='ertapenem'></td><td>Ertapenem</td><td>ertapenem</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='daptomycin'></td><td>Daptomycin</td><td>daptomycin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='carbamazepine'></td><td>Carbamazepine</td><td>carbamazepine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='adenosine'></td><td>Adenosine</td><td>adenosine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='dopamine'></td><td>Dopamine</td><td>dopamine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='gancyclovir'></td><td>Gancyclovir</td><td>gancyclovir</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='desmopressin'></td><td>Desmopressin</td><td>desmopressin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='cefotaxime'></td><td>Cefotaxime</td><td>cefotaxime</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='losartan'></td><td>Losartan</td><td>losartan</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='hetastarch_6pct_dstr/ns'></td><td>Hetastarch 6%/NS</td><td>hetastarch_6pct_dstr/ns</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='captopril'></td><td>Captopril</td><td>captopril</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='hydrochlorothiazide'></td><td>Hydrochlorothiazide</td><td>hydrochlorothiazide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='tiotropium_bromide'></td><td>Tiotropium bromide</td><td>tiotropium_bromide</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='isosorbide_dinitrate'></td><td>Isosorbide dinitrate</td><td>isosorbide_dinitrate</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='imipenem'></td><td>Imipenem</td><td>imipenem</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='d5ns'></td><td>D5NS</td><td>d5ns</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='fondaparinux'></td><td>Fondaparinux</td><td>fondaparinux</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='milrinone'></td><td>Milrinone</td><td>milrinone</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='hartmanns'></td><td>Hartmanns</td><td>hartmanns</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='nicardipine'></td><td>Nicardipine</td><td>nicardipine</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='nitroprusside'></td><td>Nitroprusside</td><td>nitroprusside</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='bivalirudin'></td><td>Bivalirudin</td><td>bivalirudin</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='penicillin_v'></td><td>Penicillin V</td><td>penicillin_v</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='plasmalyte_a'></td><td>PlasmaLyte A</td><td>plasmalyte_a</td></tr>
                            <tr><td><input class='form-check-input med' type='checkbox' value='' id='mannitol'></td><td>Mannitol</td><td>mannitol</td></tr>
                            </tbody></table>
                        </div>
                    </div>

                    <div class="blood row d-none tab">
                        <div class="col-12">
                            <p></p>
                            <p>DUSTER will calculate the total amount of blood products administered for the timespan specified on the previous page.</p>
                            <p>The field names in this table are used as suffixes for the final field names, determined in Step 4.</p>
                            <table><thead><td>Include?</td><td>Blood Product Measure</td><td>Field name suffix</td></thead><tbody>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='red_blood_cells'></td><td>Red Blood Cells</td><td>red_blood_cells</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='fresh_frozen_plasma'></td><td>Fresh Frozen Plasma</td><td>fresh_frozen_plasma</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='platelets'></td><td>Platelets</td><td>platelets</td></tr>
                            </tbody></table>
                        </div>
                    </div>

                    <div class="io row d-none tab">
                        <div class="col-12">
                            <p></p>
                            <p>DUSTER will calculate the total amount of I/O for the timespan specified on the previous page.</p>
                            <p>The field names in this table are used as suffixes for the final field names, determined in Step 4.</p>
                            <table><thead><td>Include?</td><td>Input Output Measure</td><td>Field name suffix</td></thead><tbody>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='urine_out_foley'></td><td>Urine Out Foley</td><td>urine_out_foley</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='po_intake'></td><td>Po Intake</td><td>po_intake</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='urine_out'></td><td>Urine Out</td><td>urine_out</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='dialysis_fluid_out'></td><td>Dialysis fluid out</td><td>dialysis_fluid_out</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='uretheral_catheter'></td><td>Uretheral Catheter</td><td>uretheral_catheter</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='suprapubic_catheter'></td><td>Suprapubic Catheter</td><td>suprapubic_catheter</td></tr>

                            </tbody></table>
                        </div>
                    </div>
                    <div class="vitals row d-none tab">
                        <div class="col-12">
                            <p></p>
                            <p>The following vital signs results will be selected: <strong>First, Last, Closest to 8am</strong>. You can adjust these selections on the previous page</p>
                            <p>The field names in this table are used as suffixes for the final field names, determined in Step 4.</p>
                            <table><thead><td>Include?</td><td>Vital Signs</td><td>Field name suffix</td></thead><tbody>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='pulse'></td><td>Pulse</td><td>pulse</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='bp'></td><td>Blood Pressure</td><td>bp</td></tr>
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="vent row d-none tab">
                            <div class="col-12">
                                <p></p>
                                <p>The following vent settings results will be selected: <strong>First, Last, Closest to 8am</strong>. You can adjust these selections on the previous page</p>
                                <p>The field names in this table are used as suffixes for the final field names, determined in Step 4.</p>
                                <table><thead><td>Include?</td><td>Vent Measure</td><td>Field name suffix</td></thead><tbody>
                                <tr><td><input class='form-check-input' type='checkbox' value='' id='rrtotal'></td><td>RRtotal</td><td>rrtotal</td></tr>
                                <tr><td><input class='form-check-input' type='checkbox' value='' id='fio2'></td><td>FiO2</td><td>fio2</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='pip'></td><td>PIP</td><td>pip</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='total_minute_volume'></td><td>Total Minute Volume</td><td>total_minute_volume</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='tidal_volume_-_observed'></td><td>Tidal Volume - Observed</td><td>tidal_volume_-_observed</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='peep'></td><td>PEEP</td><td>peep</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='ventilation_mode'></td><td>Ventilation Mode</td><td>ventilation_mode</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='pressure_support'></td><td>Pressure Support</td><td>pressure_support</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='peak_flow'></td><td>Peak Flow</td><td>peak_flow</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='tidal_volume_-_machine'></td><td>Tidal Volume - Machine</td><td>tidal_volume_-_machine</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='i:e'></td><td>I:E</td><td>i:e</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='rrmandatory'></td><td>RRmandatory</td><td>rrmandatory</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='inspiratory_pressure'></td><td>Inspiratory Pressure</td><td>inspiratory_pressure</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='etco2'></td><td>ETCO2</td><td>etco2</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='o2_delivery_device'></td><td>O2 Delivery Device</td><td>o2_delivery_device</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='inspiratory_time'></td><td>Inspiratory Time</td><td>inspiratory_time</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='rrspont'></td><td>RRspont</td><td>rrspont</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='o2_flow_rate_#2'></td><td>O2 Flow Rate #2</td><td>o2_flow_rate_#2</td></tr>
                            <tr><td><input class='form-check-input' type='checkbox' value='' id='o2_delivery_device_#2'></td><td>O2 Delivery Device #2</td><td>o2_delivery_device_#2</td></tr>
                            </tbody></table>
                        </div>
                    </div>
                    <p></p>    <!--  adds a bit of white space between the rows -->
                    <div class="col-6">
                    <div onclick="goToStep(3)" class="btn btn-primary">< Back</div>
                    <div onclick="goToStep(4)" class="btn btn-primary">Next ></div>
                    </div>

                </div>
            </div>
            <!-- page 6 -->
            <div id="page6" class="d-none">
                <div class="row justify-content-start">
                    <div class="col-10">
                        <h5>Design Review</h5>
                    </div>
                </div>
                <div class="row"><div class="col-12"><p>Once you accept the design shown below, you have the option of reorganizing and pruning your
                    variables by grouping them into instruments and removing unwanted fields.</p>
                    <p>You can edit the instrument names, introduce new instruments, and delete extraneous fields
                        at any time using the Data Dictionary.
                        <br>Be aware however that if you change any of the field
                        names ending in "_dstr" you will no longer get data in the renamed fields.</p>
                    <h5>Design Summary</h5>
                    <table class="tb"><thead><td>Instrument (can be renamed in Data Dictionary)</td><td>Fields (can be deleted but not renamed)</td></thead>
                        <tbody>
                        <tr>
                            <td>demographics <button type="button"  class="btn btn-light"  ><img src="<?php echo $module->getUrl("images/pencil.png"); ?>" height="20" onClick="goToPage3();"/></button></td><td>sex_dstr, gender_dstr, race_dstr, ethnicity_dstr, 	zip_dstr, birthdate_dstr,
                            alcohol_use_dstr,
                            tobacco_use_dstr,
                            drug_use_dstr,
                            enrollment_dstr,
                            weight_dstr,
                            height_dstr,
                            bmi_dstr,
                            deathdate_dstr</td>
                        </tr>
                        <tr>
                            <td>lab_icu_0 <button type="button" class="btn btn-light" aria-label="Left Align">
                                <img src="<?php echo $module->getUrl("images/pencil.png"); ?>" height="20" onClick="goToPage5();tabTo('labs');"/>
                            </button></td><td>i0_serum_glucose_dstr,
                            i0_hemoglobin_dstr,
                            i0_serum_potassium_dstr,
                            i0_serum_creatinine_dstr,
                            i0_serum_bun_dstr,
                            i0_hematocrit_dstr,
                            i0_blood_platelet_count_dstr,
                            i0_blood_mcv_dstr,
                            i0_blood_rbc_dstr,
                            i0_blood_rdw_dstr,
                            i0_blood_wbc_dstr,
                            i0_serum_hco3_dstr,
                            i0_anion_gap-arterial_dstr,
                            i0_base_excess_dstr,
                            i0_blood_neutrophils_no_dstr,
                            i0_serum_magnesium_dstr,
                            i0_po2-arterial_dstr,
                            i0_pco2-arterial_dstr,
                            i0_ph-arterial_dstr,
                            i0_serum_phosphorus_dstr,
                            i0_so2-arterial_dstr,
                            i0_serum_calcium_ionized_dstr,
                            i0_inr_dstr,
                            i0_serum_lactate_dstr,
                            i0_ptt_dstr,
                            i0_serum_bilirubin-total_dstr,
                            i0_serum_alt_dstr,
                            i0_serum_ast_dstr,
                            i0_blood_lymphocytes_pct_dstr,
                            i0_pco2-venous_dstr,
                            i0_po2-venous_dstr,
                            i0_ph-venous_dstr,
                            i0_blood_band_pct_dstr,
                            i0_serum_bilirubin-direct_dstr,
                            i0_troponin_t_dstr,
                            i0_rbc_dstr,
                            i0_serum_osmolality_dstr,
                            i0_serum_albumin_dstr,
                            i0_serum_ck_dstr,
                            i0_plasma_fibrinogen_dstr,
                            i0_serum_ammonia_dstr,
                            i0_serum_ldh_dstr,
                            i0_blood_neutrophils_pct_dstr,
                            i0_serum_lipase_dstr,
                            i0_serum_protein_dstr,
                            i0_crp_dstr,
                            i0_bnp_dstr,
                            i0_blood_reticulocytes_pct_dstr,
                            i0_hba1c_dstr,
                            i0_serum_ferritin_dstr,
                            i0_serum_ggt_dstr,
                            i0_svo2_dstr,
                            i0_fibrin_degradation_products_dstr,
                            i0_d-dimer_dstr,
                            i0_troponin_i_dstr</td>
                        </tr>
                        <tr>
                            <td>lab_icu_1 <button type="button" class="btn btn-light" aria-label="Left Align">
                                <img src="<?php echo $module->getUrl("images/pencil.png"); ?>" height="20" onClick="goToPage5();tabTo('labs');"/>
                            </button></td><td>i1_serum_glucose_dstr,
                            i1_hemoglobin_dstr,
                            i1_serum_potassium_dstr,
                            i1_serum_creatinine_dstr,
                            i1_serum_bun_dstr,
                            i1_hematocrit_dstr,
                            i1_blood_platelet_count_dstr,
                            i1_blood_mcv_dstr,
                            i1_blood_rbc_dstr,
                            i1_blood_rdw_dstr,
                            i1_blood_wbc_dstr,
                            i1_serum_hco3_dstr,
                            i1_anion_gap-arterial_dstr,
                            i1_base_excess_dstr,
                            i1_blood_neutrophils_no_dstr,
                            i1_serum_magnesium_dstr,
                            i1_po2-arterial_dstr,
                            i1_pco2-arterial_dstr,
                            i1_ph-arterial_dstr,
                            i1_serum_phosphorus_dstr,
                            i1_so2-arterial_dstr,
                            i1_serum_calcium_ionized_dstr,
                            i1_inr_dstr,
                            i1_serum_lactate_dstr,
                            i1_ptt_dstr,
                            i1_serum_bilirubin-total_dstr,
                            i1_serum_alt_dstr,
                            i1_serum_ast_dstr,
                            i1_blood_lymphocytes_pct_dstr,
                            i1_pco2-venous_dstr,
                            i1_po2-venous_dstr,
                            i1_ph-venous_dstr,
                            i1_blood_band_%_dstr,
                            i1_serum_bilirubin-direct_dstr,
                            i1_troponin_t_dstr,
                            i1_rbc_dstr,
                            i1_serum_osmolality_dstr,
                            i1_serum_albumin_dstr,
                            i1_serum_ck_dstr,
                            i1_plasma_fibrinogen_dstr,
                            i1_serum_ammonia_dstr,
                            i1_serum_ldh_dstr,
                            i1_blood_neutrophils_%_dstr,
                            i1_serum_lipase_dstr,
                            i1_serum_protein_dstr,
                            i1_crp_dstr,
                            i1_bnp_dstr,
                            i1_blood_reticulocytes_%_dstr,
                            i1_hba1c_dstr,
                            i1_serum_ferritin_dstr,
                            i1_serum_ggt_dstr,
                            i1_svo2_dstr,
                            i1_fibrin_degradation_products_dstr,
                            i1_d-dimer_dstr,
                            i1_troponin_i_dstr</td>
                        </tr>
                        </tbody>
                    </table>
                    <p></p>
                    <div onclick="goToPage5()" class="btn btn-primary"> < Back to DUSTER Designer </div>
                    <div onclick="goToPage7()" class="btn btn-primary"> Accept Design > </div>
                </div>
                </div>
            </div>
            <div id="page7" class="d-none">
                <div class="row justify-content-start">
                    <div class="col-10">
                        <h5>(Optional) How to Configure DDP</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-10">
                        <p>Congratulations, you are all set to start collecting data.</p>
                        <p>If you want to make adjustments supported by DDP, you can find
                            the DDP setup page by navigating to the Project Setup page...</p>
                    </div>
                    <div class="col-12">
                        <img class="screenshot" src="<?php echo $module->getUrl("images/ddp_setup_1.png"); ?>" width="750"/>
                        <p></p>
                    </div>
                    <div class="col-12">
                        <p>... then scrolling down to the "Set up Dynamic Data Pull (DDP) from STARR" section
                            and clicking the button "Set up mapping for Dynamic Data Pull (DDP)"</p>
                        <img class="screenshot" src="<?php echo $module->getUrl("images/ddp_setup_2.png"); ?>" width="750"/>
                        <p></p>
                        <div class="btn btn-primary">Back to my REDCap Project </div>
                    </div>
                </div>
            </div>
        </form>
</div>
<script>
    $(document).ready(function() {
        let metadata,
            demographics,
            labs,
            outcomes,
            oxygenation,
            scores,
            vitals;

        $.get('<?php echo $module->getUrl("services/callMetadata.php"); ?>', function(data) {
            goToStep(1);

            // parse metadata
            metadata     = JSON.parse(data);
            demographics = metadata.demographics;
            labs         = metadata.labs;
            outcomes     = metadata.outcomes;
            oxygenation  = metadata.oxygenation;
            scores       = metadata.scores;
            vitals       = metadata.vitals;
            /*
            $.each(metadata, function(key, category) {
                console.log(category);
            });
            */

            // insert demographics and outcomes metadata fields for step 2
            $.each(demographics, function(index, value) {
                let row = '<tr class="md-field" id="' + value.field + '-row"><td><input class="input-demographics" type="checkbox" id="checkbox-' + value.field + '"name="demographics[]" value="' + value.field + '"></td><td>' + value.label + '</td></tr>';
                $("#tbody-step2-demographics").append(row);

            });

            $.each(outcomes, function(index, value) {
                let row = '<tr class="md-field" id="' + value.field + '-row"><td><input class="input-outcomes" type="checkbox" id="checkbox-' + value.field + '"name="outcomes[]" value="' + value.field + '"></td><td>' + value.label + '</td></tr>';
                $("#tbody-step2-outcomes").append(row);
            });
        });

        // control metadata displayed according to venue choices
        $(".input-venue").change(function() {
            let venueChoices = {
                "outpatient":$("#venue-outpatient").prop('checked'),
                "ed"        :$("#venue-ed").prop('checked'),
                "inpatient" :$("#venue-inpatient").prop('checked'),
                "icu"       :$("#venue-icu").prop('checked')
            };

            /*
            // filter metadata for every category according to selected venue choices
            $.each(metadata, function(key, category) {
               filterMetadata(venueChoices, category);
            });
            */
            filterMetadata(venueChoices, demographics);
            filterMetadata(venueChoices, outcomes);

            // disable next button if no venue is selected on step 1
            $("#step1-next").prop("disabled", true);
            $("#step1-review").prop("disabled", true);
            $("#select-venue-msg").show();
            $.each(venueChoices, function(key, value) {
                if(value) {
                    $("#step1-next").prop("disabled", false);
                    $("#step1-review").prop("disabled", false);
                    $("#select-venue-msg").hide();
                    return false;
                }
            });
        });

    });


    function createProject() {
        goToStep('create');

        let dusterForm = document.getElementById('duster-form');
        let formData = new FormData(dusterForm);
        console.log(formData);

        $.ajax({
            method: 'post',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            enctype: 'multipart/form-data',
            url: '<?php echo $module->getUrl("services/getOdmXmlString.php"); ?>',
            success: function (response) {
                console.log(response);

                let projectForm = document.getElementById('project-info-form');
                let projectFormData = new FormData(projectForm);
                projectFormData.append("odm", response);
                  $.ajax({
                    method: 'post',
                    processData: false,
                    contentType: false,
                    cache: false,
                    data: projectFormData,
                    enctype: 'multipart/form-data',
                    url: '<?php echo $module->getUrl("services/createProject.php"); ?>',
                    success: function (response) {
                        console.log(response);

                        // window.location.replace(response);
                        window.location.href = response;
                        // $("#new-project-link").attr("href", response);
                        // goToStep('finished');
                    }
                });

            }
        });
    }



    // show/hide metadata according to clinical care venues selected
    // iterates over an entire category of metadata
    function filterMetadata(venueChoices, category) {
        $.each(category, function (index, mdValue) {
            let hideField = true;
            let currVenueChoices = JSON.parse(mdValue.venue);
            $.each(currVenueChoices, function (i, value) {
                // check if this metadata field needs to be shown
                if (venueChoices[value] || value == "all") {
                    $("#" + mdValue.field + "-row").show();
                    return (hideField = false); // break loop
                }
            });
            // if needed, hide metadata field and uncheck it
            if (hideField) {
                $("#checkbox-" + mdValue.field).prop('checked', false);
                $("#" + mdValue.field + "-row").hide();
            }
        });
    }

     // navigate between steps of UI
     function goToStep(step) {
         $(".step").hide();
         $('#step-' + step).show();
         document.title = 'DUSTER: ' + $("#header-step-" + step).text();
     }

     // refresh review display based on latest selections and navigate to review step
     function reviewStep() {
        // refresh demographics table
        $("#review-demographics").empty();
        $(".input-demographics:checked").each(function () {
           // let row = '<tr><td><input class="input-demographics" type="checkbox" value="' + value.field + '"></td><td>' + value.label + '</td><td>' + this.value + '_dstr</td></tr>';
            let label = $(this).parent().next('td').text();
            let row = '<tr><td>' + label + '</td><td>' + this.value + '_dstr</td></tr>';
            $("#review-demographics").append(row);
        });

        // refresh outcomes table
        $("#review-outcomes").empty();
        $(".input-outcomes:checked").each(function () {
            // let row = '<tr><td><input class="input-demographics" type="checkbox" value="' + value.field + '"></td><td>' + value.label + '</td><td>' + this.value + '_dstr</td></tr>';
            let label = $(this).parent().next('td').text();
            let row = '<tr><td>' + label + '</td><td>' + this.value + '_dstr</td></tr>';
            $("#review-outcomes").append(row);
        });

        // navigate to review step
        goToStep('review');
     }

    function toggleFormFields(cb) {
        // every element associated with a checkbox has the checkbox id as a class attribute
        // the selector for class attributes is prefixed with a period
        var myClassSelector = '.'+cb.id;
        var x = document.querySelectorAll(myClassSelector);
        // this would be more concise using jQuery
        var i;
        for (i = 0; i < x.length; i++) {
            if(cb.checked == true) {
                x[i].classList.remove("d-none");
            } else {
                x[i].classList.add("d-none");
            }
        }
    }
    function toggleCb(cb) {
        var myClassSelector = '.'+cb.id;
        var x = document.querySelectorAll(myClassSelector);
        // this would be more concise using jQuery
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].checked = cb.checked;
        }
    }
    function tabTo(tab) {
        // every element associated with a tab has the checkbox id as a class attribute
        // and class 'tab', which is used to first hide all tab content panes
        // before showing the content pane associated with the tab that was just clicked
        // the selector for class attributes is prefixed with a period
        var i;
        var t = document.querySelectorAll(".tab");
        for (i = 0; i < t.length; i++) {
            t[i].classList.add("d-none");
        }
        t = document.querySelectorAll(".nav-link");
        for (i = 0; i < t.length; i++) {
            t[i].classList.remove("active");
        }
        var myClassSelector = '.'+tab;
        var x = document.querySelectorAll(myClassSelector);
        x[0].classList.remove("d-none");
        tab.classList.add("active");
    }

</script>
</body>
</html>
