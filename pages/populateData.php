<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */


$redcap_version = explode('_',APP_PATH_WEBROOT)[1];
$record_base_url = APP_PATH_WEBROOT_FULL
    . "redcap_" . $redcap_version .'DataEntry/record_home.php?pid=' . PROJECT_ID;
$designer_url = APP_PATH_WEBROOT_FULL
    . "redcap_" . $redcap_version .'Design/online_designer.php?pid=' . PROJECT_ID;
$components_url = $module->getUrl('pages/js/PopulateDataComponents.js');

?>

<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet"
        crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet"
        crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>
<!-- Our application root element -->
<div id="app">
  <v-app>
    <h1>DUSTER: Data Upload</h1>

    <div v-if="error">
        <v-alert type="error"><span v-html="error"></span></v-alert>
      </div>

    <div v-if="!isLoading && !isLoaded">
      <p>Load your Duster Data!</p>
      <v-btn  color="primary" max-width=200 @click="loadCohort">Load</v-btn>
    </div>

    <p class="text-center" v-if="isLoading && !isLoaded">Loading <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular></p>

    <div v-if="isLoaded">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1" >
            Validate Duster Config
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2">
            Verify Request
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 3" step="3">
            Confirm Request
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 4" step="4">
            Retrieve and Save Data
          </v-stepper-step>


        </v-stepper-header>

        <v-stepper-items>

          <v-stepper-content step="1">

              <missing-fields-table
                  :table-data="dusterData.missing_fields">
              </missing-fields-table>

            <!-- No continue button if there are missing fields
            leaving in for testing
            <v-btn
                color="primary"
                @click="step = 2"
            >
              Continue
            </v-btn>-->
            <v-divider></v-divider>

            <v-btn
                text
                outlined
                @click="goToDesigner()">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div v-if="!dusterData.missing_data && !dusterData.rp_data">
              <v-alert type="error">
                No researcher provided data found.  Mrns and required dates must be entered into the project before proceeding.
              </v-alert>
            </div>

            <div v-if="dusterData.missing_data">
              <request-data-table
                  title='Missing Data'
                  alert-type="warning"
                  alert-content="There are missing dates.  Please ensure that all necessary data has been entered."
                  record-base-url="<?php echo $record_base_url?>"
                  :table-data="dusterData.missing_data"
              >
              </request-data-table>
            </div>
            <v-divider></v-divider>

            <v-btn v-if="dusterData.rp_data"
                color="primary"
                @click="step = 3"
            >
              Continue
            </v-btn>

            <v-btn text outlined @click="goToRecords()">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div v-if="dusterData.rp_data">
              <request-data-table
                  title='Data Records'
                  alert-type="info"
                  alert-content="Duster will upload data for the following records:"
                  record-base-url="<?php echo $record_base_url?>"
                  :table-data="dusterData.rp_data"
              >
              </request-data-table>
            </div>
            <v-divider></v-divider>

            <v-btn
                color="primary"
                @click="getAndSaveData()"
            >
              Submit
            </v-btn>

            <v-btn
                text
                outlined @click="goToRecords()"
            >
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <div v-if="dusterData.rp_data">
              <div class="text-center" v-if="!savedData">Retrieving data.
                <v-progress-circular
                      indeterminate
                      color="primary"
                  ></v-progress-circular>
              </div>
              <div v-else>
                <saved-data-table
                    record-base-url="<?php echo $record_base_url?>"
                    :rp-data="dusterData.rp_data"
                    :saved-data="savedData"
                >
                </saved-data-table>
                <!--pre> {{ savedData }} </pre-->
              </div>
            </div>

            <v-btn
                text
                outlined
                @click="goToRecords()">
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>

    <!--pre v-if="dusterData">{{ dusterData }}</pre-->

  </v-app>
</div>
<!-- Required scripts CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" crossorigin="anonymous"></script>
<script src="<?php echo $components_url?>" crossorigin="anonymous"></script>

<script>

  new Vue({
    el: '#app',
    components:{
      // this isn't actually necessary since it's already been registered globally
      'request-data-table': RequestDataTable
    },
    vuetify: new Vuetify(),
    data: {
      step: 0,
      error: null,
      isLoading: false,
      isLoaded: false,
      dusterData: null,
      savedData: null
    },
    methods: {
      goToDesigner() {
        window.location = '<?php echo $designer_url?>';
      },
      goToRecords() {
        window.location = '<?php echo $record_base_url?>';
      },
      loadCohort() {
        this.isLoading = true;
        let self = this;
        axios.get("<?php echo $module->getUrl("services/getData.php?action=cohort"); ?>").then(response => {
          self.isLoading = false;
          self.isLoaded = true;
          console.log(response);
          if (response.status == 200) {
            console.log(JSON.stringify(response.data));
            let data_str = JSON.stringify(response.data);
            if (data_str.indexOf('Error message') > -1) {
              self.error = data_str;
            } else {
              self.dusterData = response.data;
              if (this.dusterData.missing_fields && this.dusterData.missing_fields.length > 0) {
                self.step = 1;
              } else if (!this.dusterData.rp_data ||
                (self.dusterData.missing_data && this.dusterData.missing_data.length > 0)) {
                self.step = 2;
              } else {
                self.step = 3;
              }
            }
          } else {
            self.error='Cohort response error: ' + response.message;
          }
        });
      },
      getAndSaveData() {
        this.step = 4;
        let cohort = {};
        cohort.redcap_project_id = parseInt(this.dusterData.redcap_project_id);

        cohort.cohort = this.dusterData.rp_data;
        //console.log("cohort = '" + JSON.stringify(cohort) + "'");
        //console.log("url = " +
        //    < ?php echo '"' . $module->getUrl("services/getData.php?action=getData") . '"'; ?>
        //  +"&cohort=" + JSON.stringify(cohort));
        let self = this;
        let formData = new FormData();
        formData.append('redcap_csrf_token', "<?php echo $module->getCSRFToken(); ?>");
        formData.append('data', JSON.stringify(cohort));
        axios.post("<?php echo $module->getUrl("services/getData.php?action=getData"); ?>",
          formData).then(response => {
          console.log(JSON.stringify(response.data));
          if (response.status == 200) {
            let data_str = JSON.stringify(response.data);
            if (data_str.indexOf('Uncaught Error:') > -1 ||
              data_str.indexOf('Error message') > -1) {
              self.error='System error: ' + data_str.data;
            } else if (response.data.errors.length > 0) {
              self.error='Redcap save error: ' + JSON.stringify(response.data.errors);
            } else {
              self.savedData = response.data;
            }
          } else {
            self.error='Data retrieve error: ' + response.message;
          }
        }).catch(function(error) {
          self.error=error.message;
          console.log(error);
        });;
      }
    }
  })
</script>
</body>
</html>
