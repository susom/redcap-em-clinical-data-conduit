<template>
  <div class="container">
    <div class="grid">
      <div class="col-offset-1 col-10">
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

        <div v-show="!showSummary">

          <p>Define your project.</p>
            <div class="grid">
            <div class="col-6">
            <ResearcherProvidedPanel
                v-model:rp-provided-data="rpProvidedData"
                :reserved-field-names="reservedFieldNames"
                @update-rp-date="updateRpDate"
                @delete-rp-date="deleteRpDate"
            />
            </div>
          <!--RpInfoPanel
            v-model:rp-identifiers="rpIdentifiers"
            v-model:rp-dates="rpDates"
            @update-rp-date="updateRpDate"
            @delete-rp-date="deleteRpDate"
          /-->
            <div class="col-6">

            <DemographicsPanel
                class="flex-1"
                :demographics-options="demographicsOptions"
                v-model:demographics-selects="demographicsSelects"
            />
            </div>
        </div>
        <div class="grid">
            <div class="col">
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
        <div class="grid">
            <div class="col">
                <Toast />
                <Toolbar class="col">
                    <template #start>
                        <Button type="submit" label="Review & Create Project" class="ml-2"
                        @click="checkValidation"/>
                    </template>
                </Toolbar>
            </div>
        </div>
        </div>

        <div :style="(showSummary) ?  '': 'display: none !important'">
          <ReviewPanel
              v-model:show-summary="showSummary"
              :rp-identifiers="rpIdentifiers"
              :rp-dates="rpDates"
              :demographics="demographicsSelects"
              :collection-windows="collectionWindows"
              :project-info="projectConfig"
              :dev="dev"
              />
        </div>
      </div>
    </div>
</div>
  <Dialog v-model:visible="irbCheckVisible" modal header="Checking IRB" :style="{ width: '50vw' }">
    <p>
      <span v-html="irbCheckMessage"></span>
    </p>
    <div v-if="!irbValid && irbCheckStatus==='checked'" class="field">
      <label>IRB Number: </label>
      <InputText v-model="projectIrb"/>
    </div>
    <template #footer>
      <Button v-if="!irbValid && irbCheckStatus==='checked'"
              label="Try again" icon="pi pi-refresh" class="p-button-success" @click="irbRetry" text />
      <Button label="Cancel" icon="pi pi-times" @click="irbCheckCancel" text />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, watchEffect} from 'vue'

import axios from 'axios'
import type FieldMetadata from "@/types/FieldMetadata";
import type {BasicConfig} from "@/types/FieldConfig";
import type CollectionWindow from "@/types/CollectionWindow";

import ResearcherProvidedPanel from "@/components/ResearcherProvidedPanel.vue";
import DemographicsPanel from './components/DemographicsPanel.vue'
import CollectionWindowsPanel from './components/CollectionWindowsPanel.vue'
import ReviewPanel from './components/ReviewPanel.vue'

// for testing
import resp from './dusterTestMetadata.json';
import {useToast} from "primevue/usetoast";
import Toast from 'primevue/toast'
import {useVuelidate} from "@vuelidate/core";

const projectConfig = JSON.parse(localStorage.getItem('postObj') || '{}');
console.log("postObj" + localStorage.getItem('postObj'))
localStorage.removeItem('postObj');
const dev = ref<boolean>(false)

const showSummary = ref<boolean>(false)

const rpProvidedData = ref<BasicConfig[]>([
    {
      redcap_field_name: "mrn",
      label:"MRN",
      redcap_field_type:"text",
      value_type:"Identifier", // this needs to be replace by "text" in review step
      redcap_field_note:"8-digit number (including leading zeros, e.g., '01234567')",
      phi:"t",
      id: "mrn",
      duster_field_name: undefined
    },
    {
      redcap_field_name: "enroll_date",
      redcap_field_type:"text",
      value_type: "date",
      label: "Study Enrollment Date",
      phi: "t",
      id: "enroll_date",
      duster_field_name: undefined
    }])

// separating out identifiers and dates for review step
const rpIdentifiers = computed(() => {
  return rpProvidedData.value.filter((rpi:BasicConfig) => rpi.value_type?.toLowerCase() === 'identifier')
})
const rpDates = computed(() => {
  return rpProvidedData.value.filter((rpi:BasicConfig) => rpi.value_type?.toLowerCase() !== 'identifier')
})

const demographicsOptions = ref<FieldMetadata[]>([])
const labOptions = ref<FieldMetadata[]>([])
const vitalOptions = ref<FieldMetadata[]>([])
const outcomeOptions = ref<FieldMetadata[]>([])
const scoreOptions = ref<FieldMetadata[]>([])
const clinicalDateOptions = ref<FieldMetadata[]>([])

const demographicsSelects = ref<FieldMetadata[]>([])
const collectionWindows = ref<CollectionWindow[]>([])

const projectIrb = ref<string>(projectConfig.project_irb_number)
const irbValid = ref<boolean>(false)
const irbCheckStatus = ref<string>("checking")
const irbCheckMessage = ref<string>("Checking IRB #" + projectIrb.value + " ...")
const irbCheckVisible = ref<boolean>(false)

onMounted(() => {
  // check irb
  checkIrb(projectConfig.check_irb_url, projectConfig.redcap_csrf_token, projectConfig.project_irb_number)
})

watchEffect(() => {
  if (irbValid.value) {
    getDusterMetadata(projectConfig.metadata_url)
  }
})

const checkIrb = (checkIrbUrl:string, redcapCsrfToken: string, projectIrbNumber: string) => {
  if (dev.value) {
    irbValid.value = true
  } else {
    irbCheckVisible.value = true
    let formData = new FormData();
    formData.append('redcap_csrf_token', redcapCsrfToken);
    formData.append("project_irb_number", projectIrbNumber);
    axios.post(checkIrbUrl, formData)
        .then(function (response) {
          // response.data === 1 is valid
          irbCheckStatus.value = 'checked'
          if (response.data === 1) {
            irbValid.value = true
            irbCheckMessage.value = "IRB " + projectIrbNumber + " check success.  Fetching Duster metadata."
          } else {
            irbValid.value = false
            irbCheckMessage.value = "IRB " + projectIrbNumber
                + " is invalid. Enter a different IRB to try again."
          }

        })
        .catch(function (error) {
          irbValid.value = false
          irbCheckMessage.value = "IRB Check Error"
          console.log(error)
        });
  }
}

const irbRetry = () => {
  irbCheckStatus.value = "retry"
  irbCheckMessage.value = "Checking IRB #" + projectIrb.value + " ..."
  checkIrb(projectConfig.check_irb_url, projectConfig.redcap_csrf_token, projectIrb.value)
}

const irbCheckCancel = () => {
  irbCheckVisible.value = false
  // return to project create page for invalid IRBs
  if (!irbValid.value) {
    window.location.href = projectConfig.redcap_new_project_url
  }
}

const getDusterMetadata = (metadataUrl:string) => {
  if (dev.value) {
  demographicsOptions.value = resp.data.demographics;
  labOptions.value = resp.data.labs;
  vitalOptions.value = resp.data.vitals;
  outcomeOptions.value = resp.data.outcomes;
  scoreOptions.value = resp.data.scores;
  clinicalDateOptions.value = resp.data.clinical_dates
  } else {

    axios.get(metadataUrl)
        .then(response => {
          demographicsOptions.value = response.data.demographics;
          labOptions.value = response.data.labs;
          vitalOptions.value = response.data.vitals;
          outcomeOptions.value = response.data.outcomes;
          scoreOptions.value = response.data.scores;
          clinicalDateOptions.value = response.data.clinical_dates
          irbCheckVisible.value = false
        }).catch(function (error) {
      irbCheckMessage.value = "Unable to load Duster metadata"
      console.log(error)
    });
  }
}

const updateRpDate = (rpDate:BasicConfig) => {
  let updated = false;
  for(let index=0; index< rpProvidedData.value.length; index++) {
    if (rpProvidedData.value[index].id === rpDate.id) {
      rpProvidedData.value[index].redcap_field_name = rpDate.redcap_field_name
      rpProvidedData.value[index].label = rpDate.label
      updated = true
    }
  }
  if (!updated) {
    rpDates.value.push(rpDate);
  }
}

const deleteRpDate = (rpDate:BasicConfig) => {
  rpProvidedData.value = rpProvidedData.value.filter(item => item.id !== rpDate.id)
}
const toast = useToast();

// tracks all redcap field names to ensure uniqueness
const reservedFieldNames = computed(() => {
  // reserve the demographics names?
  if (demographicsOptions.value && demographicsOptions.value.length > 0) {
    return demographicsOptions.value.map(demo => demo.duster_field_name)
  }
  return []
})

const v$ = useVuelidate()

const checkValidation = () => {
  v$.value.$touch()

  toast.removeAllGroups()
  if (!v$.value.$error) {
    showSummary.value = true
  } else {
    console.log(v$)
    v$.value.$errors.forEach(error =>
        toast.add({
          severity: 'error',
          summary: 'Missing values', detail: error.$message,
          life: 3000
        })
    )
  }
  return false
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
