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
    <h1>DUSTER: Data Upload</h1>

    <div v-if="errorMessage">
        <v-alert type="error"><span v-html="errorMessage"></span></v-alert>
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
                @click="goToUrl(designer_url)">
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

            <v-btn text outlined @click="goTo(record_base_url)">
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
                  Cancel Data Load
                </v-card-title>
                <v-card-text>
                  <v-alert type="warning">
                    Are you sure you want to cancel the data upload?  Data that has already been saved to Redcap will
                    not be deleted.
                  </v-alert>'

                </v-card-text>
                <v-card-actions>
                  <v-btn
                      outlined
                      text
                      @click="goToUrl(record_base_url)"
                  >
                    Cancel Upload
                  </v-btn>
                  <v-btn
                      color="primary"
                      @click="confirmCancel = false"
                  >
                    Continue Upload
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-divider></v-divider>
            <v-btn v-if="saveProgress < 100"
                text
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

      getAndSaveData() {
        this.step = 4;
        const numSaves = this.queries.length + 1;
        const saveSize = 100/numSaves;
        let self = this;
        axios.get("<?php echo $module->getUrl("services/getData.php?action=syncCohort&pid=$project_id"); ?>").then
        (response1 => {
          console.log(JSON.stringify(response1));
          if (!self.hasError(self, response1)) {
            self.saveProgress += saveSize;
            self.saveMessage = "Cohort sync complete."
            for(let i=0; i< self.queries.length; i++) {
              axios.get("<?php echo $module->getUrl("services/getData.php?action=getData&pid=$project_id&query=");
                ?>" + JSON.stringify(self.queries[i]))
                .then(response2 => {
                  console.log(JSON.stringify(response2));
                  if (!self.hasError(self, response2)) {
                    const resp_data2 = response2.data;
                    self.saveProgress += saveSize;
                    if (self.saveProgess === 100) {
                      self.saveMessage = "Data save complete";
                    } else {
                      self.saveMessage = resp_data2.message;
                    }
                  }
                  }).catch(function(error) {
                    self.errorMessage +=error.message + '<br>';
                    console.log(error);
                  });
            }
          }
        }).catch(function(error) {
          this.errorMessage +=error.message + '<br>';
          console.log(error);
        });
      }
    }
  })
</script>
</body>
</html>
