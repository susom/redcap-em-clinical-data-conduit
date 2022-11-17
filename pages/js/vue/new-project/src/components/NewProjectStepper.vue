<template>
  <v-container>
    <v-container
      v-if="!metadata_loaded"
    >
      <v-card-title>
        <h2 class="primary--text">Retrieving DUSTER metadata...</h2>
      </v-card-title>
    </v-container>

    <v-container
      v-if="metadata_loaded"
    >
      <v-stepper
        v-model="step"
        outlined
      >
        <v-stepper-header>
          <v-stepper-step
            :complete="step > 1"
            step="1"
          >
            Researcher-Provided Info
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="step > 2"
            step="2"
          >
            Demographics
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="step > 3"
            step="3"
          >
            Clinical Dates
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="step > 4"
            step="4"
          >
            Clinical Data
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="5">
            Review
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <!-- Researcher-Provided Info -->
          <ResearcherProvidedInfoStep
            :rp_identifiers_prop.sync="rp_identifiers"
            :rp_dates_prop.sync="rp_dates"
          />

          <!-- Demographics -->
          <DemographicsStep
            :demographics_prop.sync="demographics"
          />

          <!-- Clinical Dates -->
          <ClinicalDatesStep/>

          <!-- Data Collection Windows -->
          <DataCollectionWindowsStep
            :clinical_dates_prop="clinical_dates"
            :collection_windows_prop.sync="collection_windows"
            :labs_prop="labs"
            :rp_dates_prop="rp_dates"
            :show_window_form_prop.sync="show_window_form"
            :vitals_prop="vitals"
          />

          <!-- Review -->
          <ReviewStep
            :collection_windows="collection_windows"
            :create_project_url="api_urls.create_project"
            :demographics="demographics"
            :project_info="project_info"
            :redcap_csrf_token="redcap_csrf_token"
            :rp_dates="rp_dates"
          />
        </v-stepper-items>
      </v-stepper>
      <v-row>
        <v-col
          cols="auto"
          v-show="step == 1"
        >
            <v-btn
              color="secondary"
              type="submit"
            >
              &lt; Back to DUSTER Intro
            </v-btn>
        </v-col>
        <v-col
          cols="auto"
          v-show="step > 1"
        >
          <v-btn
            color="primary"
            @click="backStep"
            :disabled="show_window_form"
          >
            &lt; Back
          </v-btn>
        </v-col>
        <v-col
          cols="auto"
          v-show="step < 5"
        >
          <v-btn
            color="primary"
            @click="nextStep"
            :disabled="show_window_form"
          >
            Next &gt;
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

    </v-container>
  </v-container>
</template>

<script>
import axios from 'axios'

import ResearcherProvidedInfoStep from "@/components/ResearcherProvidedInfoStep";
import DemographicsStep from "@/components/DemographicsStep";
import ClinicalDatesStep from "@/components/ClinicalDatesStep";
import DataCollectionWindowsStep from "@/components/DataCollectionWindowsStep";
import ReviewStep from "@/components/ReviewStep";

export default {
  name: "NewProjectStepper",
  data: function () {
    return {
      api_urls: {
        create_project: "",
        metadata: ""
      },
      project_info: {
        surveys_enabled: "",
        repeatforms: "",
        scheduling: "",
        randomization: "",
        app_title: "",
        purpose: "",
        project_pi_firstname: "",
        project_pi_mi: "",
        project_pi_lastname: "",
        project_pi_email: "",
        project_pi_alias: "",
        project_irb_number: "",
        purpose_other: "",
        project_note: "",
        projecttype: "",
        repeatforms_chk: "",
        project_template_radio: "",
      },
      redcap_csrf_token: "",
      clinical_dates: [],
      collection_windows: [],
      metadata_loaded: false,
      step: 1,
      show_window_form: false,
      rp_identifiers: [
        {
          label: "MRN",
          redcap_field_name: "mrn",
          format: "8-digit number (including leading zeros, e.g., '01234567')"
        }
      ],
      rp_dates: [
        {
          id: 0,
          label: "Study Enrollment Date",
          redcap_field_name: "enroll_date",
          format: "date"
        }
      ],
      demographics: {
        options: [],
        selected: []
      },
      labs: [],
      vitals: []
    }
  },
  mounted() {
    const postObj = JSON.parse(localStorage.getItem('postObj'));
    localStorage.removeItem('postObj');
    this.api_urls.create_project = postObj.create_project_url;
    this.api_urls.metadata = postObj.metadata_url;
    this.project_info.surveys_enabled = postObj.surveys_enabled;
    this.project_info.repeatforms = postObj.repeatforms;
    this.project_info.scheduling = postObj.scheduling;
    this.project_info.randomization = postObj.randomization;
    this.project_info.app_title = postObj.app_title;
    this.project_info.purpose = postObj.purpose;
    this.project_info.project_pi_firstname = postObj.project_pi_firstname;
    this.project_info.project_pi_mi = postObj.project_pi_mi;
    this.project_info.project_pi_lastname = postObj.project_pi_lastname;
    this.project_info.project_pi_email = postObj.project_pi_email;
    this.project_info.project_pi_alias = postObj.project_pi_alias;
    this.project_info.project_irb_number = postObj.project_irb_number;
    this.project_info.purpose_other = postObj.purpose_other;
    this.project_info.project_note = postObj.project_note;
    this.project_info.projecttype = postObj.projecttype;
    this.project_info.repeatforms_chk = postObj.repeatforms_chk;
    this.project_info.project_template_radio = postObj.project_template_radio;
    this.redcap_csrf_token = postObj.redcap_csrf_token;
    this.create_project_url = postObj.create_project_url;

    // request metadata from STARR-API
    axios.get(this.api_urls.metadata).then(response => {
      console.log(response.data);

      // add demographics
      for(const demographic of response.data.demographics) {
        this.demographics.options.push(
          {
            label: demographic.label,
            duster_field_name: demographic.duster_field_name,
            redcap_field_name: demographic.duster_field_name
          }
        );
      }

      // add clinical dates
      this.clinical_dates = response.data.clinical_dates;

      // add labs
      for(const lab of response.data.labs) {
        this.labs.push(
          {
            duster_field_name: lab.duster_field_name,
            label: lab.label,
            category: lab.category
          }
        );
      }

      // add vitals
      for(const vital of response.data.vitals) {
        this.vitals.push(
          {
            duster_field_name: vital.duster_field_name,
            label: vital.label,
            category: vital.category
          }
        );
      }

      this.metadata_loaded = true;
    });
  },
  methods: {
    backStep() {
      if (this.step > 1) {
        this.step -= 1;
      }
    },
    nextStep() {
      if (this.step < 5) {
        this.step += 1;
        if(this.step == 5) {
          // this.instruments = Array.from(Array(2 + this.config.collection_windows.length).keys());
        }
      }
    }
  },
  components: {
    ResearcherProvidedInfoStep,
    DemographicsStep,
    ClinicalDatesStep,
    DataCollectionWindowsStep,
    ReviewStep
  }
}
</script>

<style scoped>

</style>
