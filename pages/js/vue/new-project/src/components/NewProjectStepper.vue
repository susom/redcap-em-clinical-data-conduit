<template>
  <v-container pa-0>

    <DusterIntro @success="step = 1"  v-show="step == -1"/>

    <h2 class="primary--text" v-if="!metadata_loaded && step > -1">Retrieving DUSTER metadata...</h2>

    <v-container pa-0
      v-if="metadata_loaded && step > -1"
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
          <v-stepper-content step="1">
            <ResearcherProvidedInfoStep
              :rp_identifiers_prop.sync="rp_identifiers"
              :rp_dates_prop.sync="rp_dates"
            />
          </v-stepper-content>

          <!-- Demographics -->
          <v-stepper-content step="2">
            <DemographicsStep
              :demographics_prop.sync="demographics"
            />
          </v-stepper-content>

          <!-- Clinical Dates -->
          <v-stepper-content step="3">
            <ClinicalDatesStep/>
          </v-stepper-content>

          <!-- Data Collection Windows -->
          <v-stepper-content step="4">
            <DataCollectionWindowsStep
              :clinical_dates_prop="clinical_dates"
              :collection_windows_prop.sync="collection_windows"
              :labs_prop="labs"
              :outcomes_prop="outcomes"
              :rp_dates_prop="rp_dates"
              :scores_prop="scores"
              :show_window_form_prop.sync="show_window_form"
              :vitals_prop="vitals"
            />
          </v-stepper-content>

          <!-- Review -->
          <v-stepper-content step="5">
            <ReviewStep
              :collection_windows="collection_windows"
              :create_project_url="urls.create_project"
              :demographics="demographics"
              :project_info="project_info"
              :redcap_csrf_token="redcap_csrf_token"
              :rp_dates="rp_dates"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-row
        class="pt-4"
      >
        <v-col
          cols="auto"
          v-show="step == 1"
        >
            <v-btn
              color="secondary"
              @click="step = -1"
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

import DusterIntro from "@/components/DusterIntro" ;
import ResearcherProvidedInfoStep from "@/components/ResearcherProvidedInfoStep";
import DemographicsStep from "@/components/DemographicsStep";
import ClinicalDatesStep from "@/components/ClinicalDatesStep";
import DataCollectionWindowsStep from "@/components/DataCollectionWindowsStep";
import ReviewStep from "@/components/ReviewStep";

export default {
  name: "NewProjectStepper",
  data: function () {
    return {
      urls: {
        create_project: "",
        metadata: "",
        new_project_intro: ""
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
      step: -1,
      show_window_form: false,
      rp_identifiers: [
        {
          label: "MRN",
          redcap_field_name: "mrn",
          redcap_field_type: "8-digit number (including leading zeros, e.g., '01234567')"
        }
      ],
      rp_dates: [
        {
          label: "Study Enrollment Date",
          redcap_field_name: "enroll_date",
          redcap_field_type: "date"
        }
      ],
      demographics: {
        options: [],
        selected: []
      },
      labs: [],
      vitals: [],
      outcomes: [],
      scores: [],
      scores_meta: {}
      // subscores: []
    }
  },
  mounted() {
    const postObj = JSON.parse(localStorage.getItem('postObj'));
    localStorage.removeItem('postObj');
    this.urls.create_project = postObj.create_project_url;
    this.urls.metadata = postObj.metadata_url;
    this.urls.new_project_intro = postObj.new_project_intro_url;
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

    // request metadata from STARR-API
    axios.get(this.urls.metadata).then(response => {
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

      // add outcomes
      for(const outcome of response.data.outcomes) {
        this.outcomes.push(
            {
              duster_field_name: outcome.duster_field_name,
              label: outcome.label,
              category: outcome.category,
              redcap_field_type: outcome.redcap_field_type,
              redcap_options: outcome.redcap_options
            }
        );
      }

      // add scores
      for(const score of response.data.scores) {
        this.scores.push(
          {
            duster_field_name: score.duster_field_name,
            label: score.label,
            category: score.category,
            redcap_field_type: score.redcap_field_type,
            redcap_field_note: score.redcap_field_note,
            redcap_options: score.redcap_options,
            subscores: score.subscores
          }
        )
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
    ReviewStep,
    DusterIntro
  }
}
</script>

<style scoped>

</style>
