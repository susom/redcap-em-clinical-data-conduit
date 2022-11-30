<template>
  <v-container pa-0>
    <v-card
      flat
    >
      <v-card-text>
        <p>
          Below is an overview of the REDCap instruments and REDCap fields that will be created based on the choices made in previous steps.
        </p>
      </v-card-text>
    </v-card>

    <!-- Place collapse/expand panels in a grid to maintain constant size with block prop -->
    <v-row>
      <v-col
        cols="4"
      >
        <v-btn
          color="secondary"
          block
          class="mb-4"
          @click="instruments = instruments.length > 0 ? [] : Array.from(Array(2 + config.collection_windows.length).keys())"
        >
          {{ instruments.length > 0 ? 'Collapse all instruments' : 'Expand all instruments'}}
        </v-btn>
      </v-col>
    </v-row>

    <v-expansion-panels
      v-model="instruments"
      multiple
      accordion
    >
      <!-- Researcher-Provided Info -->
      <v-expansion-panel>
        <v-expansion-panel-header>Instrument: Researcher-Provided Info (researcher_provided_info)</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            outlined
            class="mb-4"
          >
            <v-card-subtitle><h2>Identifier</h2></v-card-subtitle>
            <v-data-table
              :headers="review_id_headers"
              :items="config.rp_info.rp_identifiers"
              item-key="label"
              fixed-header
              dense
              hide-default-footer
            >
              <template v-slot:[`item.format`]="">
                <span>8-digit number (including leading zeros, e.g., '01234567')</span>
              </template>
            </v-data-table>

          </v-card>
          <v-card
            outlined
            class="mb-4"
          >
            <v-card-subtitle><h2>Dates</h2></v-card-subtitle>
            <v-data-table
              :headers="review_date_headers"
              :items="Object.values(config.rp_info.rp_dates)"
              item-key="label"
              fixed-header
              dense
              hide-default-footer
            >
              <template v-slot:[`item.format`]="{ item }">
                <span>{{item.format}} [{{item.format=="date" ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:MM:SS'}}]</span>
              </template>
            </v-data-table>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Demographics -->
      <v-expansion-panel>
        <v-expansion-panel-header>Instrument: Demographics (demographics)</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            outlined
          >
            <v-data-table
              :headers="review_demo_headers"
              :items="config.demographics"
              item-key="label"
              no-data-text="No demographics have been selected."
              fixed-header
              dense
              hide-default-footer
            ></v-data-table>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>


      <!-- Clinical Data -->
      <v-expansion-panel
        v-for="cw in config.collection_windows"
        :key="cw.id"
      >
        <v-expansion-panel-header>Instrument: {{cw.label}} ({{cw.form_name}})</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            outlined
            class="mb-4"
          >
            <v-card-subtitle><h2>Timing</h2></v-card-subtitle>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title>Start</v-list-item-title>
                <v-list-item-subtitle>Label: {{cw.timing.start.label}}</v-list-item-subtitle>
                <v-list-item-subtitle>REDCap field name: {{cw.timing.start.redcap_field_name}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title>End</v-list-item-title>
                <v-list-item-subtitle>Label: {{cw.timing.end.label}}</v-list-item-subtitle>
                <v-list-item-subtitle>REDCap field name: {{cw.timing.end.redcap_field_name}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            outlined
            class="mb-4"
          >
            <v-card-subtitle><h2>Labs</h2></v-card-subtitle>
            <v-data-table
              :headers="review_cw_headers"
              :items="cw.data.labs"
              item-key="label"
              no-data-text="No labs have been selected."
              fixed-header
              dense
              hide-default-footer
            ></v-data-table>
          </v-card>
          <v-card
            outlined
            class="mb-4"
          >
            <v-card-subtitle><h2>Vitals</h2></v-card-subtitle>
            <v-data-table
              :headers="review_cw_headers"
              :items="cw.data.vitals"
              item-key="label"
              no-data-text="No vitals have been selected."
              fixed-header
              dense
              hide-default-footer
            ></v-data-table>
          </v-card>
          <v-card
              outlined
              class="mb-4"
          >
          <v-card-subtitle><h2>Outcomes</h2></v-card-subtitle>
          <v-data-table
              :headers="review_cw_headers"
              :items="cw.data.outcomes"
              item-key="label"
              no-data-text="No outcomes have been selected."
              fixed-header
              dense
              hide-default-footer
          ></v-data-table>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-if="save_error">
      <v-alert type="error"><span v-html="save_error"></span></v-alert>
    </div>
    <v-btn
      color="primary"
      class="mt-4"
      @click="createProject"
    >
      Create Project
    </v-btn>
    <v-dialog
      v-model="createProjectDialog"
      hide-overlay
      persistent
      width="350"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text class="pt-3">
          Creating REDCap Project. Please stand by...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-2 mt-3"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>    
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: "ReviewStep",
  props: {
    'collection_windows': Array,
    'create_project_url': String,
    'demographics': Object,
    'project_info': Object,
    'redcap_csrf_token': String,
    'rp_dates': Array,
  },
  data: function() {
    return {
      instruments: [],
      review_id_headers: [
        {text: 'Label', value: 'label', sortable: false},
        {text: 'REDCap field name', value: 'redcap_field_name', sortable: false},
        {text: 'Format', value: 'format', sortable: false}
      ],
      review_date_headers: [
        {text: 'Label', value: 'label'},
        {text: 'REDCap field name', value: 'redcap_field_name'},
        {text: 'Format', value: 'format'}
      ],
      review_demo_headers: [
        {text: 'Label', value: 'label'},
        {text: 'REDCap field name', value: 'redcap_field_name'},
      ],
      review_cw_headers: [
        {text: 'Label', value: 'label'},
        {text: 'REDCap field name', value: 'redcap_field_name'}
      ],
      save_error: null,
      createProjectDialog: false
    }
  },
  computed: {
    config: {
      get: function() {
        let config = {
          rp_info: {
            rp_identifiers: [
              {
                redcap_field_name: "mrn",
                label: "Medical Record Number (MRN)",
                format: "text"
              }
            ],
            rp_dates: {}
          },
          demographics: [],
          collection_windows: []
        };

        // Researcher-Provided Dates
        let datesArr = [];
        this.rp_dates.forEach((date) => {
          datesArr.push([date.redcap_field_name, {
            redcap_field_name: date.redcap_field_name,
            label: date.label,
            format: date.format
          }]);
        });
        config.rp_info.rp_dates = Object.fromEntries(datesArr);

        // demographics
        this.demographics.selected.forEach((demographic) => {
          config.demographics.push({
            duster_field_name: demographic.duster_field_name,
            redcap_field_name: demographic.redcap_field_name,
            label: demographic.label,
            format: "text"
          });
        });

        // data collection windows
        let cwArr = [];
        this.collection_windows.forEach((window, index) => {
          let newCW = {
            label: window.label,
            form_name: this.getFormName(window.label, cwArr.map(value => value.form_name)),
            type: window.type,
            timing: {
            },
            data: {
              labs: [],
              vitals: [],
              outcomes: []
            }
          };

          let timing = window.timing;
          if(window.type === "nonrepeating") {

            // get the DUSTER field name for the start parameter for timing
            let startDusterField = timing.start !== null && Object.prototype.hasOwnProperty.call(timing.start, 'duster_field_name') ? timing.start.duster_field_name : null;

            // get the REDCap field name for the start and end parameters for timing
            let startRCField = 'cw' + index + '_start_dttm';
            /*
            let suffixNum;
            if(this.checkRCFieldExists(startRCField)) {
                suffixNum = 0;
                while(this.checkRCFieldExists(startRCField + '_' + suffixNum)) {
                    suffixNum++;
                }
                startRCField = startRCField + '_' + suffixNum;
            }
            // console.log(startRCField);
             */

            // get the rp_date for the start parameter for timing
            let startRPDate = startDusterField !== null ? timing.start_based : timing.start.redcap_field_name;

            // get the REDCap label for the start parameter for timing
            let startLabel = timing.start.label;
            if(timing.start_type === 'date' || timing.start.format === 'date') {
              startLabel = '00:00:00 on the Calendar Day of ' + timing.start.label;
            }

            // get the DUSTER field name for the end parameter for timing
            let endDusterField = timing.end !== null && Object.prototype.hasOwnProperty.call(timing.end, "duster_field_name") ? timing.end.duster_field_name : null;

            // get the REDCap field name for the end parameter for timing
            let endRCField = 'cw' + index + '_end_dttm';
            /*
            if(this.checkRCFieldExists(endRCField)) {
                suffixNum = 0;
                while(this.checkRCFieldExists(endRCField + '_' + suffixNum)) {
                    suffixNum++;
                }
                endRCField = endRCField + '_' + suffixNum;
            }
            // console.log(endRCField);
             */

            // get the rp_date for the end parameter for timing
            let endRPDate = null;
            if(timing.end_type === 'dttm') {
              endRPDate = endDusterField !== null ? timing.end_based : timing.end.redcap_field_name;
            }

            // get the REDCap label for the end parameter for timing
            let endLabel = "";
            if(timing.end_type === 'dttm') {
              if(timing.end.format === 'date') {
                endLabel = 'Midnight on the Calendar Day of ' + timing.end.label;
              } else {
                endLabel = timing.end.label;
              }
            } else if(timing.end_type === 'day') {
              endLabel = 'Midnight on the Calendar Day of ' + timing.start.label;
            } else if(timing.end_type === 'hours') {
              endLabel = timing.num_hours + ' hours after ' + startLabel;
            }

            let timingObj = {
              start: {
                type: timing.start_type,
                duster_field_name: startDusterField,
                redcap_field_name: startRCField,
                // based_on: timing.start_based,
                rp_date: startRPDate,
                label: startLabel
              },
              end: {
                type: timing.end_type,
                num_hours: timing.num_hours,
                duster_field_name: endDusterField,
                redcap_field_name: endRCField,
                // based_on: timing.end_based,
                rp_date: endRPDate,
                label: endLabel
              }
            };
            newCW.timing = timingObj;
          }

          // labs and vitals
          let lvArr = window.data.labs_vitals;
          lvArr.forEach((item) => {
            // create a new field for each aggregate
            let itemArr = [];
            let rcField = '';
            // let suffixNum = 0;
            let aggregates = window.aggregate_defaults;
            if(item.aggregates.default === false) {
              aggregates = item.aggregates;
            }

            // minimum aggregate
            if(aggregates.min === true) {
              rcField = item.duster_field_name + '_min_' + index;
              /*
              if(this.checkRCFieldExists(rcField)) {
                  suffixNum = 0;
                  while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                      suffixNum++;
                  }
                  rcField = rcField + '_' + suffixNum;
              }
              // console.log(rcField);
               */

              itemArr.push({
                duster_field_name: item.duster_field_name,
                redcap_field_name: rcField,
                label: 'Minimum ' + item.label,
                format: "text",
                aggregate: "min_agg"
              });
            }

            // maximum aggregate
            if(aggregates.max === true) {
              rcField = item.duster_field_name + '_max_' + index;
              /*
              if(this.checkRCFieldExists(rcField)) {
                  suffixNum = 0;
                  while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                      suffixNum++;
                  }
                  rcField = rcField + '_' + suffixNum;
              }
              // console.log(rcField);
               */

              itemArr.push({
                duster_field_name: item.duster_field_name,
                redcap_field_name: rcField,
                label: 'Maximum ' + item.label,
                format: "text",
                aggregate: "max_agg"
              });
            }

            // first aggregate
            if(aggregates.first === true) {
              rcField = item.duster_field_name + '_first_' + index;
              /*
              if(this.checkRCFieldExists(rcField)) {
                  suffixNum = 0;
                  while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                      suffixNum++;
                  }
                  rcField = rcField + '_' + suffixNum;
              }
              // console.log(rcField);
               */

              itemArr.push({
                duster_field_name: item.duster_field_name,
                redcap_field_name: rcField,
                label: 'First ' + item.label,
                format: "text",
                aggregate: "first_agg"
              });
            }

            // last aggregate
            if(aggregates.last === true) {
              rcField = item.duster_field_name + '_last_' + index;
              /*
              if(this.checkRCFieldExists(rcField)) {
                  suffixNum = 0;
                  while(this.checkRCFieldExists(rcField + '_' + suffixNum)) {
                      suffixNum++;
                  }
                  rcField = rcField + '_' + suffixNum;
              }
              // console.log(rcField);
              */


              itemArr.push({
                duster_field_name: item.duster_field_name,
                redcap_field_name: rcField,
                label: 'Last ' + item.label,
                format: "text",
                aggregate: "last_agg"
              });
            }

            // closest to start datetime aggregate
            if(aggregates.closest_start === true) {
              // TODO
            }

            // closest to a specific time aggregate
            if(aggregates.closest_time === true) {
              // TODO
            }


            if(item.category === 'labs') {
              newCW.data.labs.push(...itemArr);
            } else {
              newCW.data.vitals.push(...itemArr);
            }

          });

          // outcomes
          let outcomesArr = window.data.outcomes;
          outcomesArr.forEach((item) => {
              let rcField = item.duster_field_name + '_' + index;
              newCW.data.outcomes.push({
                duster_field_name: item.duster_field_name,
                redcap_field_name: rcField,
                label: item.label,
                format: item.field_type,
                options: item.options
              });
          });
//                        console.log(newCW);
          cwArr.push(newCW);
        });

        // set cwArr to this.config's collection windows
        config.collection_windows = cwArr;
        return config;
      }
    }
  },
  methods: {
    createProject() {
      this.createProjectDialog = true ;
      let data = {
        surveys_enabled: this.project_info.surveys_enabled,
        repeatforms: this.project_info.repeatforms,
        scheduling: this.project_info.scheduling,
        randomization: this.project_info.randomization,
        app_title: this.project_info.app_title,
        purpose: this.project_info.purpose,
        project_pi_firstname: this.project_info.project_pi_firstname,
        project_pi_mi: this.project_info.project_pi_mi,
        project_pi_lastname: this.project_info.project_pi_lastname,
        project_pi_email: this.project_info.project_pi_email,
        project_pi_alias: this.project_info.project_pi_alias,
        project_irb_number: this.project_info.project_irb_number,
        purpose_other: this.project_info.purpose_other,
        project_note: this.project_info.project_note,
        projecttype: this.project_info.projecttype,
        repeatforms_chk: this.project_info.repeatforms_chk,
        project_template_radio: this.project_info.project_template_radio,
        config: this.config
      };
      // console.log(JSON.stringify(data, null, 2));

      let formData = new FormData();
      formData.append('redcap_csrf_token', this.redcap_csrf_token);
      formData.append('data', JSON.stringify(data));
      let self = this;

      // use services/importMetadata.php if project has already been created
      // let axios = require('axios');
      // console.log("pre axios");
      axios.post(this.create_project_url, formData)
        .then(function(response) {
          console.log("ajax response");
          console.log(response);
            // console.log("Response data: " + response.data);
            if (response.data.indexOf('Uncaught Error') > -1 ||
              response.data.indexOf('Error message') > -1) {
              console.log("Found Error");
              self.save_error = response.data;
              self.createProjectDialog = false ;
            } else {
              window.location.href = response.data;
              console.log(response.data);
            }
          })
        .catch(function(error) {
          self.save_error=error.message;
          self.createProjectDialog = false ;

          console.log("Catch: " + error);
        });
    },
    getFormName(label, cwArr) {
      // remove whitespace at start and end and convert to lowercase characters only
      let formName = label.trim().toLowerCase();
      // replace spaces with underscore
      formName = formName.replaceAll(' ', '_');

      // remove illegal characters
      formName = formName.replaceAll(/[^a-z_0-9]/g, '');

      // remove any double underscores
      while(formName.indexOf('__') != -1) {
        formName = formName.replaceAll('__', '_');
      }
      // remove beginning underscores
      while(formName.substring(0, 1) == '_') {
        formName = formName.substring(1);
      }
      // remove ending underscores
      while(formName.substring(formName.length - 1) == '_') {
        formName = formName.substring(0, formName.length - 1);
      }
      // remove beginning numerals
      while(/^\d$/g.test(formName.substring(0, 1))) {
        formName = formName.substring(1);
      }
      // remove beginning underscores again
      while(formName.substring(0, 1) == '_') {
        formName = formName.substring(1);
      }

      // ensure formName doesn't begin with a number and formName cannot be blank
      if(/^\d$/.test(formName.substring(0, 1)) || formName == '') {
        // console.log("MD5");
        let md5 = require('md5');
        formName = md5(formName).replaceAll(/[0-9]/g, '').substring(0, 4) + formName;
      }

      // if longer than 50 characters, substring formName to 50 characters
      formName = formName.substring(0, 50);

      // ensure formName doesn't already exist
      let formNamesArr = ['researcher_provided_information', 'demographics'].concat(cwArr);
      while(formNamesArr.includes(formName)) {
        // substring formName to less than 50 characters in length
        formName = formName.substring(0, 44);
        // append random values to formName to prevent duplication
        formName = formName + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString().substring(0, 6);
        // formName = formName + CryptoJS.SHA1(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).substring(0, 6);
      }

      return formName;
    },
  },
  watch: {
    config: function() {
      this.instruments = [];
    }
  }
}
</script>

<style scoped>

</style>
