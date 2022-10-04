<?php
namespace Stanford\Duster;
/** @var $module Duster */

// TODO require_once APP_PATH_DOCROOT . 'Views/HomeTabs.php';
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" crossorigin="anonymous">
    <!-- Bootstrap CSS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <link rel="icon" type="image/ico" href="data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wDa2vAkgYHMtWxsxJPw8PkM////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wCiotpaCgqd8z8/sv8AAJn/ICCl3szM6jH///8A////AP///wD///8A////AP///wD///8A////AP///wCGhs53AACZ/wAAmf8/P7L/AACZ/wAAmf8KCp31vLzkQf///wD///8A////AP///wD///8A////AP///wCiotpaISGm/S8vrP8vL6z/Pz+y/wAAmf8AAJn/Cwud/xsbo/DU1O4p////AP///wD///8A////AP///wDe3vIfDAyd83xwy/+kjtz/wrPn/z8/sv8AAJn/AACZ/1pavf9ISLb/MDCsz/r6/QP///8A////AP///wD///8AWFi8pk5MuP+biNj/jG/S/5uD2P8/P7L/AACZ/wAAmf9FRbT/mprW/wwMnf+YmNZl////AP///wD///8A4ODyHQQEmvxmZML/tKLi/7yr5f93dcj/Pz+y/wAAmf8QEJ//nZ3Y/3Z2yP8AAJn/Jiao2f///wD///8A////AIqK0HIAAJn/VFK7/2tTxf+Xidb/Jiao/z8/sv8AAJn/Jiao/6ys3v8wMKz/AACZ/wAAmf/Kyuoy////AP///wBiYr+1ICCl/yAgpf8gIKX/ICCl/yAgpf9XV7z/AACZ/wAAmf9KSrb/k5PU/ywsqv8AAJn/iIjPdf///wD///8AQkKz4jMzrf9SUrr/d3fJ/0lJtv8vL6z/Y2PA/wAAmf8AAJn/PDyx/2NjwP9nZ8L/AACZ/1xcvaH///8A////AAUFmv1kZMH/ysrp/9XV7v+2tuH/NDSu/z8/sv8AAJn/AACZ/29vxf+np9v/BASa/wAAmf9CQrO9////AP///wAGBpv/m5vX/4eHz//u7vj/Tk64/5eX1f8/P7L/AACZ/ywsqv+qqt3/QECy/wAAmf8AAJn/QECyv////wD///8AAgKZ/QAAmf9ra8T/3d3x/ykpqf8CApn/Pz+y/wcHm/+JidD/MDCs/1dXvP8AAJn/AACZ/0BAsr3///8A////ABgYouUAAJn/Wlq9/9/f8v8XF6L/AACZ/z8/sv8UFKH/kZHT/6el3P9iYsD/AACZ/wAAmf9YWLym////AP///wBCQrO9AACZ/yMjp/+vr9//BASa/wAAmf8/P7L/AACZ/wAAmf8ICJz/AACZ/wAAmf8AAJn/goLNff///wD///8Ajo7ScCAgpd4gIKXeS0u33iAgpd4gIKXeV1e73iAgpd4gIKXeICCl3iAgpd4gIKXeICCl3sbG6Dj///8A/n8AAPw/AAD4HwAA8A8AAOAHAADABwAAwAMAAMADAACAAwAAgAEAAIABAACAAQAAgAEAAIABAACAAwAAwAMAAA=="/>

    <title>DUSTER</title>
</head>
<body>

<!-- application root element -->
<div id="intro">
    <v-app>
        <v-container>
            <h1>DUSTER: Data Upload Service for Translational rEsearch on Redcap</h1>
        </v-container>
        <!-- checking IRB -->
        <v-container
            v-if="irb_flag === 0"
        >
            <v-card-title>
                <h2 class="primary--text">Checking IRB...</h2>
            </v-card-title>
        </v-container>

        <!-- IRB is valid -->
        <v-container
            v-else-if="irb_flag === 1"
        >
            <v-card
                flat
            >
                <v-card-title>
                    <h2 class="primary--text">Introduction</h2>
                </v-card-title>
                <v-row>
                    <v-col
                        class="10"
                    >
                        <v-card-text>
                            <p>
                                Welcome to Stanford REDCap's DUSTER, a self-service tool to automatically import clinical data associated with research subjects in your study.
                            </p>
                            <p>
                                DUSTER has both patient data and structured clinical data. A small set of demographics, lab results, and vitals are currently available with more on the way;
                                we also plan to expand our structured clinical data offerings to include inpatient outcomes, risk scores, and medications.
                            </p>
                            <p>
                                You can use DUSTER to populate a newly created REDCap project.
                                We plan to support adding DUSTER to an existing project in the future.
                            </p>
                            <p>
                                Once you have specified the time frames and variable selection algorithms for the clinical variables of interest, DUSTER will automatically import all data for your cohort.
                            </p>
                        </v-card-text>
                    </v-col>
                    <v-col class="1">
                        <img class="screenshot" src="<?php echo $module->getUrl("images/duster_infographic.png") ?>" height="200"  />
                    </v-col>
                    <v-col class="1">
                        <img class="screenshot" src="<?php echo $module->getUrl("images/duster_logo_cropped.png") ?>" height="200"  />
                    </v-col>
                </v-row>

                <v-card-title>
                    <h2 class="primary--text">How Does It Work?</h2>
                </v-card-title>
                <v-card-text>
                    <p>
                        DUSTER requires each REDCap record to contain an MRN and a clinical date (e.g., an enrollment date or visit date).
                        These two fields are needed to identify the requested data.
                        By default, an enrollment date is designated as the clinical date.
                        This can be changed at the final step of DUSTER's project creation wizard.
                    </p>
                    <p>
                        You can choose to create each record one at a time using standard REDCap data entry (left), or you can import your
                        records using REDCap's data import tool (right).
                    </p>
                </v-card-text>

                <v-row>
                    <v-col
                        cols="6"
                    >
                        <img class="screenshot" src="<?php echo $module->getUrl("images/option_1_data_entry.png") ?>" height="200" />

                    </v-col>
                    <v-col
                        cols="6"
                    >
                        <img class="screenshot" src="<?php echo $module->getUrl("images/option2_data_import.png") ?>" height="100" />
                    </v-col>
                </v-row>


                <v-row>
                    <v-col
                        cols="auto"
                    >
                        <v-btn
                            color="secondary"
                            href="<?php echo APP_PATH_WEBROOT_FULL . "index.php?action=create"; ?>"
                        >
                            < Back to REDCap New Project Page
                        </v-btn>
                    </v-col>
                    <v-col
                        cols="auto"
                    >
                        <v-form
                            action="<?php echo $module->getUrl("pages/newProject.php", false, true) ?>"
                            method="post"
                            id="project-form"
                        >
                            <input type="hidden" name="type" value="module">
                            <?php
                            foreach($_POST as $name=>$value) {
                                $value = is_array($value) ? implode(",", $value) : $value;
                                echo "<input type=\"hidden\" name=\"$name\" value=\"$value\">";
                            }
                            echo "<input type=\"hidden\" name=\"redcap_csrf_token\"value=\"{$module->getCSRFToken()}\">";
                            ?>
                            <v-btn
                                color="primary"
                                type="submit"
                            >
                                Let's Get Started >
                            </v-btn>
                        </v-form>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-card>
        </v-container>

        <!-- IRB is invalid -->
        <v-container
            v-else-if="irb_flag === -1"
        >
            <v-card
                flat
            >
                <v-card-title>
                    <h2 class="error--text">Invalid IRB Entered</h2>
                </v-card-title>
                <v-card-text>
                        <p>
                            Creating a new project in DUSTER requires a valid IRB.
                            <br>
                            <br>
                            Press the button below to go back to REDCap's New Project Page.
                        </p>
                </v-card-text>
                <v-row>
                    <v-col>
                        <v-btn
                            color="secondary"
                            href="<?php echo APP_PATH_WEBROOT_FULL . "index.php?action=create"; ?>"
                        >
                            < Back to REDCap's New Project Page
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>

        </v-container>
    </v-app>
</div>

<!-- Required scripts CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js" crossorigin="anonymous"> </script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" crossorigin="anonymous"></script>

<script>
    new Vue({
        el: '#intro',
        vuetify: new Vuetify(),
        data: {
            irb_flag: 0 // 0 if checking IRB, -1 if IRB invalid, 1 if IRB valid
        },
        mounted () {
            let formData = new FormData();
            formData.append('redcap_csrf_token', "<?php echo $module->getCSRFToken(); ?>");
            formData.append("project_irb_number", "<?php // echo $_POST["project_irb_number"] ?>");
            let self = this;

            axios.post("<?php echo $module->getUrl("services/checkIRB.php"); ?>", formData)
                .then(function(response) {
                    self.irb_flag = response.data === 1 ? 1 : -1;
                    console.log(self.irb_flag);
                })
                .catch(function(error) {
                    // TODO
                });
        },
        methods: {
            /*
            getStarted() {
                let formData = new FormData();
                formData.append('redcap_csrf_token', "<?php // echo $module->getCSRFToken(); ?>");
                formData.append('surveys_enabled', this.surveys_enabled);
                formData.append('repeatforms', this.repeatforms);
                formData.append('scheduling', this.scheduling);
                formData.append('randomization', this.randomization);
                formData.append('app_title', this.app_title);
                formData.append('purpose', this.purpose);
                formData.append('project_pi_firstname', this.project_pi_firstname);
                formData.append('project_pi_mi', this.project_pi_mi);
                formData.append('project_pi_lastname', this.project_pi_lastname);
                formData.append('project_pi_email', this.project_pi_email);
                formData.append('project_pi_alias', this.project_pi_alias);
                formData.append('project_irb_number', this.project_irb_number);
                formData.append('purpose_other', this.purpose_other);
                formData.append('project_note', this.project_note);
                formData.append('projecttype', this.projecttype);
                formData.append('repeatforms_chk', this.repeatforms_chk);
                formData.append('project_template_radio', this.project_template_radio);

                axios.post("<?php // echo $module->getUrl("pages/newProject.php", false, true) ?>", formData);

            }
            */
        }
    })

</script>
</body>
</html>
