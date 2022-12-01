<?php
namespace Stanford\Duster;
/** @var \Stanford\Duster\Duster $module */


$redcap_version = explode('_',APP_PATH_WEBROOT)[1];
$record_base_url = APP_PATH_WEBROOT_FULL
    . "redcap_" . $redcap_version .'DataEntry/record_home.php?pid=' . PROJECT_ID;
$designer_url = APP_PATH_WEBROOT_FULL
    . "redcap_" . $redcap_version .'Design/online_designer.php?pid=' . PROJECT_ID;
$data_exports_url = APP_PATH_WEBROOT_FULL
    . "redcap_" . $redcap_version .'DataExport/index.php?pid=' . PROJECT_ID;
$components_url = $module->getUrl('pages/js/PopulateDataComponents.js');
$project_id = PROJECT_ID;

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
    <h1>DUSTER: Get Data</h1>

    <div v-if="errorMessage">
        <v-alert type="error"><span v-html="errorMessage"></span></v-alert>
      </div>

    <div v-if="!isLoading && !isLoaded">
      <p>Click the button below to begin.</p>
      <v-btn  color="primary" max-width=200 @click="loadCohort">Begin</v-btn>
    </div>

    <p class="text-center" v-if="isLoading && !isLoaded">Loading <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular></p>

    <div v-if="isLoaded">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1" >
            Validate DUSTER Config
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
            Retrieve & Save Data
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
                @click="goToUrl(designer_url)">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div v-if="!dusterData.missing_data && !dusterData.rp_data">
              <v-alert type="error">
                Your REDCap project contains no records. Add at least one record to your project in order to proceed.
              </v-alert>
            </div>

            <div v-if="dusterData.missing_data">
              <request-data-table
                  title='Missing Researcher-Provided Information'
                  alert-type="warning"
                  alert-content="You may still continue, but DUSTER may not be able to retrieve all possible data on records with missing researcher-provided information."
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

            <v-btn text outlined @click="goTo(record_base_url)">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div v-if="dusterData.rp_data">
              <request-data-table
                  title='Data Records'
                  alert-type="info"
                  alert-content="DUSTER will attempt to get data for the following records:"
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
                outlined @click="goToUrl(record_base_url)"
            >
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <div class="text-center" v-if="dusterData.rp_data">
              <p>{{saveMessage}}</p>
              <v-progress-linear
                  v-model="saveProgress"
                  height="25"
                  stream
              >
                <strong>{{ Math.ceil(saveProgress) }}%</strong>
              </v-progress-linear>
            </div>
            <v-dialog
                v-model="confirmCancel"
                max-width="500px"
            >
              <v-card>
                <v-card-title>
                  Cancel Data Retrieval
                </v-card-title>
                <v-card-text>
                  <v-alert type="warning">
                      <p>
                          Are you sure you want to cancel data retrieval?
                          <br>
                          Data that has already been saved to REDCap will not be deleted.
                      </p>
                  </v-alert>

                </v-card-text>
                <v-card-actions>
                  <v-btn
                      color="error"
                      outlined
                      @click="goToUrl(record_base_url)"
                  >
                    Yes, Cancel
                  </v-btn>
                  <v-btn
                      color="primary"
                      @click="confirmCancel = false"
                  >
                    No, Continue
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-divider></v-divider>
            <v-btn v-if="saveProgress < 100"
                color="error"
                outlined
                @click="confirmCancel = true">
              Cancel
            </v-btn>
            <v-btn v-else
                   color="primary"
                   @click="goToUrl(data_exports_url)"
            >
            Export Data
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
<script src="https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js" crossorigin="anonymous"></script>
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
      project_id: <?php echo $project_id?>,
      record_base_url : '<?php echo $record_base_url?>',
      designer_url: '<?php echo $designer_url?>',
      data_exports_url: '<?php echo $data_exports_url?>',
      step: 0,
      errorMessage: "",
      isLoading: false,
      isLoaded: false,
      confirmCancel: false,
      dusterData: null,
      saveProgress:0,
      saveMessage:"Saving ...",
      queries:null
    },
    methods: {
      goToUrl(url) {
        window.location = url;
      },
      hasError(self, response) {
        if (response.status !== 200) {
          self.errorMessage = response.message;
          return true;
        } else if (response.data.status && response.data.status !== 200) {
          self.errorMessage += response.data.message + '<br>';
          return true;
        } else {
          const data_str = JSON.stringify(response.data).toLowerCase();
          if (data_str.indexOf('error message') !== -1  ||
            data_str.indexOf('syntax error') !== -1 ||
            data_str.indexOf('fatal error') !== -1) {
            self.errorMessage += data_str;
            console.log("error data_str:" + data_str);
            return true;
          }
        }
        return false;
      },
      loadCohort() {
        this.isLoading = true;
        let self = this;
        axios.get("<?php echo $module->getUrl("services/getData.php?action=cohort&pid=$project_id"); ?>").then
        (response => {
          self.isLoading = false;
          self.isLoaded = true;
          if (!self.hasError(self, response)) {
            self.dusterData = response.data;
            self.queries = response.data.queries;
            if (self.dusterData.missing_fields && self.dusterData.missing_fields.length > 0) {
              self.step = 1;
            } else
            if (!this.dusterData.rp_data ||
              (self.dusterData.missing_data != null && self.dusterData.missing_data.length > 0)) {
              self.step = 2;
            } else {
              self.step = 3;
            }
          }
        }).catch(function(error) {
          this.errorMessage +=error.message + '<br>';
          console.log(error);
        });
      },
      async getAndSaveData() {
        this.step = 4;
        const numSaves = this.queries.length + 1;
        const saveSize = 100 / numSaves;
        let self = this;
        try {
          const cohortSync = await axios.get("<?php echo $module->getUrl("services/getData.php?action=syncCohort&pid=$project_id"); ?>");

          console.log(JSON.stringify(cohortSync));
          this.saveProgress += saveSize;
          if (!this.hasError(this, cohortSync)) {
            this.saveMessage = "Cohort sync complete."
            for (let i = 0; i < this.queries.length; i++) {
              console.log(JSON.stringify(this.queries[i]));
              const dataSync = await axios.get("<?php echo $module->getUrl("services/getData.php?action=getData&pid=$project_id&query=");?>" + JSON.stringify(this.queries[i]));
              console.log(JSON.stringify(dataSync));
              this.saveProgress += saveSize;
              if (this.saveProgress > 99.5) {
                this.saveProgress = 100;
              }
              if (!this.hasError(this, dataSync)) {
                const resp_data2 = dataSync.data;
                if (this.saveProgess === 100) {
                  this.saveMessage = "Data save complete";
                } else {
                  this.saveMessage = resp_data2.message;
                }
              }
            }
          }
        } catch (error) {
          this.errorMessage += error.message + '<br>';
          console.log(error);
        }
      }
    }
  })
</script>
</body>
</html>
