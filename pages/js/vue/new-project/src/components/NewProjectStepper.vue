<template>
  <v-container>
    {{collection_windows}}
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
          :demographics="demographics"
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
</template>

<script>

import ResearcherProvidedInfoStep from "@/components/ResearcherProvidedInfoStep";
import DemographicsStep from "@/components/DemographicsStep";
import ClinicalDatesStep from "@/components/ClinicalDatesStep";
import DataCollectionWindowsStep from "@/components/DataCollectionWindowsStep";
import ReviewStep from "@/components/ReviewStep";

export default {
  name: "NewProjectStepper",
  data: function () {
    return {
      clinical_dates: [],
      collection_windows: [],
      step: 5,
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
        options: [
          {
            label:"First Name",
            duster_field_name:"first_name",
            redcap_field_name:"first_name"
          },
          {
            label:"Last Name",
            duster_field_name:"last_name",
            redcap_field_name:"last_name"
          },
          {
            label:"Sex",
            duster_field_name:"sex",
            redcap_field_name:"sex"
          },
          {
            label:"Race",
            duster_field_name:"race",
            redcap_field_name:"race"
          },
          {
            label:"Ethnicity",
            duster_field_name:"ethnicity",
            redcap_field_name:"ethnicity"
          },
          {
            label:"Birth Date",
            duster_field_name:"birth_date",
            redcap_field_name:"birth_date"
          }
        ],
        selected: []
      },
      labs: [],
      vitals: []
    }
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
