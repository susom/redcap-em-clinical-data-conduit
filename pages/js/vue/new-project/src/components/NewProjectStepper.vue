<template>
  <v-container>
    <v-title>{{greeting}}</v-title>
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
        <ResearcherProvidedInfoStep v-bind:greeting="greeting"/>

        <!-- Demographics -->
        <DemographicsStep/>

        <!-- Clinical Dates -->
        <ClinicalDatesStep/>

        <!-- Data Collection Windows -->
        <DataCollectionWindowsStep/>

        <!-- Review -->
        <ReviewStep/>
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
      greeting: 'Hello',
      step: 1,
      show_window_form: false
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
