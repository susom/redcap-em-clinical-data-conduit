<template>
  <div class="container">
    <div class="grid">
      <div class="col-offset-2 col-8">
        <nav>          
          <div class="grid">
            <div class="col">          
              <a class="brand-logo" href="https://med.stanford.edu/">Stanford Medicine</a>
              <div style="display:inline;float:left" class="mt-2">
                <div class="font-bold text-left">DUSTER</div>
                <div class="text-sm font-italic">Research Technology, TDS</div>          
              </div>
            </div>
            <div class="col mt-2">
              <p class="text-xl font-italic">Data Upload Service for Translational rEsearch on Redcap</p>    
            </div>
          </div>          
          <div class="grid text-white text-lg" style="background-color: #53565A;">        
            <div class="col-offset-9 col-2">          
              <a href="https://med.stanford.edu/duster" class="text-white" target="_blank">Duster Website</a>
            </div>
          </div>          
        </nav>

        <div class="grid">
          <div class="col-6">
          <RpInfoPanel
            v-model:rp-identifiers="rpIdentifiers"
            v-model:rp-dates="rpDates"
            @update-rp-date="updateRpDate"
            @delete-rp-date="deleteRpDate"
          />
            <div>rp dates: {{ rpDates }}</div>

        </div>
        <div class="col-6">
            <DemographicsPanel
                :demographics-options="demographicsOptions"
                v-model:demographics-selects="demographicsSelects"
            />
            <div>Checked names: {{ demographicsSelects }}</div>
        </div>
        <CollectionWindowsPanel
            :lab-options="labOptions"
            :vital-options="vitalOptions"
            :score-options="scoreOptions"
            :outcome-options="outcomeOptions"
            :clinical-date-options="clinicalDateOptions"
            :rp-dates="rpDates"
            v-model:collection-windows="collectionWindows"
        />
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

import axios from 'axios'
import RpInfoPanel from './components/RpInfoPanel.vue'
import DemographicsPanel from './components/DemographicsPanel.vue'
import CollectionWindowsPanel from './components/CollectionWindowsPanel.vue'

import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type DusterMetadata from "@/types/DusterMetadata";
import type TimingConfig from "@/types/TimingConfig";
import type CollectionWindow from "@/types/CollectionWindow";

// for testing
import resp from './dusterTestMetadata.json';

const postObj = JSON.parse(localStorage.getItem('postObj') || '{}');
const create_project_url = postObj.create_project_url
//const metadata_url = postObj.metadata_url
//const metadata_url="http://localhost/redcap_v12.2.4/ExternalModules/?prefix=duster&page=services/callMetadata"
const metadata_url="http://localhost/redcap_v13.3.0/ExternalModules/?prefix=duster&page=services/callMetadata"

const new_project_intro_url = postObj.new_project_intro_url;
const redcap_csrf_token = postObj.redcap_csrf_token
const rpIdentifiers = ref<FieldConfig[]>([
    {redcap_field_name: "mrn",
      label:"MRN",
      redcap_field_type:"8-digit number (including leading zeros, e.g., '01234567')",
      value_type:"text",
      phi:"t"
    }])

const rpDates = ref<TimingConfig[]>([
    {type:"date",
      duster_field_name: null,
      rp_date: "enroll_date",
      redcap_field_name: "enroll_date",
      redcap_field_type:"date",
      value_type: "string",
      label: "Study Enrollment Date",
      phi: "t",
      id: "enroll_date"
    }])
const dusterMetadata = ref<DusterMetadata>()
const demographicsOptions = ref<FieldMetadata[]>([])
const labOptions = ref<FieldMetadata[]>([])
const vitalOptions = ref<FieldMetadata[]>([])
const outcomeOptions = ref<FieldMetadata[]>([])
const scoreOptions = ref<FieldMetadata[]>([])
const clinicalDateOptions = ref<FieldMetadata[]>([])

const demographicsSelects = ref<FieldMetadata[]>([])
const collectionWindows = ref<CollectionWindow[]>([])

const project_info = {
  surveys_enabled: postObj.surveys_enabled,
  repeatforms: postObj.repeatforms,
  scheduling: postObj.scheduling,
  randomization: postObj.randomization,
  app_title: postObj.app_title,
  purpose: postObj.purpose,
  project_pi_firstname: postObj.project_pi_firstname,
  project_pi_mi: postObj.project_pi_mi,
  project_pi_lastname: postObj.project_pi_lastname,
  project_pi_email: postObj.project_pi_email,
  project_pi_alias: postObj.project_pi_alias,
  project_irb_number: postObj.project_irb_number,
  purpose_other: postObj.purpose_other,
  project_note: postObj.project_note,
  projecttype: postObj.projecttype,
  repeatforms_chk: postObj.repeatforms_chk,
  project_template_radio: postObj.project_template_radio
};
// request metadata from STARR-API
// this is a dummy call for now
onMounted(() => {
  axios.get(metadata_url).then(response => {
    demographicsOptions.value = resp.data.demographics;
    labOptions.value = resp.data.labs;
    vitalOptions.value = resp.data.vitals;
    outcomeOptions.value = resp.data.outcomes;
    scoreOptions.value = resp.data.scores;
    clinicalDateOptions.value = resp.data.clinical_dates
  });
})

const updateRpDate = (rpDate:TimingConfig) => {
  let updated = false;
  for(let index=0; index< rpDates.value.length; index++) {
    if (rpDates.value[index].id === rpDate.id) {
      rpDates.value[index].redcap_field_name = rpDate.redcap_field_name
      rpDates.value[index].label = rpDate.label
      rpDates.value[index].rp_date = rpDate.redcap_field_type
      updated = true
    }
  }
  if (!updated) {
    rpDates.value.push(rpDate);
  }
}

const deleteRpDate = (rpDate:TimingConfig) => {
  rpDates.value = rpDates.value.filter(item => item.id !== rpDate.id)
}

</script>


<style scoped lang="scss">
  nav {
    padding: 10px;
    text-align: center;
  }
  .brand-logo {
      position: relative;
      z-index: 10;
      float: left;
      display: block;    
      width: 12em;    
      height: 3em;
      margin-right: 10px;
      margin-right: .7em;
      text-indent: -9999px;
      background: url(@/assets/images/logo_uid_stanfordmedicine.svg) no-repeat;
      background-position: -11px -1px;
      background-position: -0.7857142857142857rem -0.07142857142857142rem;
      background-size: auto 111%;
      border-right: 1px solid;
      border-right: .07142857142857142rem solid;
      border-right-color: #000;
  }
</style>

