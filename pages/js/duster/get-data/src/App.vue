<template>
  <div class="container ml-0 mr-0 pr-0 pl-0">
    <div class="grid">
      <div class="col-10">
        <div class="projhdr">DUSTER: Get Data</div>
        <div>You have two options to request data.
          <ul>
            <li>Real time - Data will fetch in real time. This browser tab must be kept open and closing it will stop the process.</li>
            <li>Background - Data will fetch in the background. You may safely close your browser and the process will still continue. An email notification will send upon completion.</li>
          </ul>
        </div>
        <div v-if="errorMessage">
          <Message :closable="false" severity="error"><span v-html="errorMessage"></span></Message>
          <!-- display button to Project Setup if error is due to production status -->
          <Button
              v-if="!isProduction"
              class="p-button-primary" size="small" icon="pi pi-cog"
              label="Project Setup"
              @click="goToUrl(project_setup_url)"
          />
        </div>

        <div>

          <p class="text-center mt-5" v-if="isLoading && !isLoaded && !errorMessage">
            <i class="pi pi-spin pi-spinner mr-3" style="font-size: 2rem;color: dodgerblue"></i> Loading...
          </p>
          <div v-if="isLoaded">
            <div v-if="step ==1 && dusterData.missing_fields">
              <div>
                <MissingFieldsTable
                    :table-data="dusterData.missing_fields">
                </MissingFieldsTable>
              </div>
              <div>
                <Button
                    class="p-button-primary" size="small" icon="pi pi-cog"
                    label="Project Setup"
                    @click="goToUrl(designer_url)"/>
              </div>
            </div>
            <div v-if="step==2">
              <div>
                <div v-if="!dusterData.missing_data && !dusterData.rp_data">
                  <div class="text-xl p-2 mb-1 font-italic mr-5 text-red-500">
                    ERROR: Your REDCap project contains no records. Add at least one record to your project in order to proceed.
                  </div>
                </div>
                <div v-else-if="dusterData.missing_data">
                  <RequestDataTable
                      title='Missing Researcher-Provided Information'
                      alert-type="warn"
                      alert-content="The following records are missing required Researcher-Provided Data.  You may continue, but DUSTER may not retrieve all possible data for these records."
                      :record-base-url="record_base_url"
                      :table-data="dusterData.missing_data"
                  >
                  </RequestDataTable>
                </div>
                <div>
                  <Button v-if="dusterData.rp_data"
                          label="Continue"
                          class="p-button-primary" size="small" icon="pi pi-caret-right"
                          @click="step = 3"
                  />
                  <!--
                  <Button text outlined @click="goToUrl(record_base_url)"
                          class="p-button-secondary" size="small" icon="pi pi-times"
                          label="Cancel"
                  />
                  -->
                </div>
              </div>
            </div>

            <div v-if="step == 3">
              <Message severity="info" v-if="previousRequestStatus">
                {{ previousRequestStatus }}
              </Message>
              <div v-if="dusterData.rp_data">
                <div>
                <div class="formgroup-inline">
                  <div class="field">
                  <label class="font-bold block mb-2">Retrieve Data for</label>
                  <SelectButton v-model="selectedRecordsOption"
                                :options="selectedRecordsOptions"
                                :disabled="selectedRecordsOptionsDisabled"
                                optionLabel="name"
                                aria-labelledby="basic" />
                    <small v-if="selectedRecordsOptionsDisabled"
                           class="flex p-error mb-3">
                      'All' option is disabled. Number of records <br>
                      is limited to {{ maxCohortSize }} for data retrieval.
                    </small>
                  </div>
                  <div class="field" v-if="selectedRecordsOption.name == 'Sub-cohort'">
                    <label for="minRecordId" class="font-bold block mb-2"> Minimum Record Id </label>
                    <InputNumber v-model="selectedRecordsMin"
                                 inputId="minRecordId"
                                  :min="dusterData.rp_data[0].redcap_record_id"
                                  :max="selectedRecordsMax"
                                 :class="{ 'p-invalid': v$.selectedRecordsMin.$error }"
                                 @update:model-value="updateCohortMax"
                    />
                    <small v-if="v$.selectedRecordsMin.$error"
                           class="flex p-error mb-3">
                      {{ v$.selectedRecordsMin.$errors[0].$message }}
                    </small>
                  </div>

                  <div class="field" v-if="selectedRecordsOption.name == 'Sub-cohort'">
                    <label for="maxRecordId" class="font-bold block mb-2"> Maximum Record Id </label>
                    <InputNumber v-model="selectedRecordsMax"
                                 inputId="maxRecordId"
                                 :min="selectedRecordsMin"
                                 :max="dusterData.rp_data[dusterData.rp_data.length - 1].redcap_record_id"
                                 :class="{ 'p-invalid': v$.selectedRecordsMax.$error }"
                                 @update:model-value="updateCohortMin"

                    />
                    <small v-if="v$.selectedRecordsMax.$error"
                           class="flex p-error mb-3">
                      {{ v$.selectedRecordsMax.$errors[0].$message }}
                    </small>
                  </div>
                  </div>
                  <!--set selectable to false for now.  Too complicated with multiple
                  inputs
                  :selectable="selectedRecordsOption == 'Subset'"-->
                  <RequestDataTable
                      title='Data Records'
                      alert-type="info"
                      alert-content="Select records to retrieve from Duster: "
                      :record-base-url="record_base_url"
                      :table-data="dusterData.rp_data"
                      :selectable="false"
                      :selected-records-min = "selectedRecordsMin"
                      :selected-records-max = "selectedRecordsMax"
                      @update:selected-records="(records) => selectedRecords = records"
                  >
                  </RequestDataTable>
                </div>
                <div>
                  <Button
                      class="p-button-primary" size="small" icon="pi pi-caret-right"
                      label="Run in real time"
                      @click="runInRealtime()"
                  />
                  <Button
                      class="mx-2 p-button-primary" size="small" icon="pi pi-forward"
                      label="Run in background"
                      @click="runInBackground()"
                  />
                  <!--
                  <Button
                      class="p-button-secondary" size="small" icon="pi pi-times"
                      label="Cancel"
                      @click="goToUrl(project_setup_url)"
                  />
                  -->
                </div>
              </div>
            </div>

            <div v-if="step == 4">
              <Message :closable="false" severity="warn" v-if="!isAsyncRequest && totalProgress < 100">
                Do not click on other links or close this browser tab/window until the data request is complete.
              </Message>
              <p><strong>
                <span v-html="saveMessage"></span> <span v-html="nextAsyncUpdateMessage"></span>
              </strong>
              </p>
              <!--synchronized request progress display-->
              <div class="text-left" v-if="!isAsyncRequest && dusterData.rp_data">
                <div class="grid">
                  <div class="col-3"><b>Researcher-Provided Information:</b>
                    <span v-if="cohortMessage"><br>{{ cohortMessage }}</span>
                  </div>
                  <div class="col-8">
                    <ProgressBar
                        :value="cohortProgress"
                        height="25"
                    >
                      <strong>{{ cohortProgress }}%</strong>
                    </ProgressBar>
                  </div>
                </div>

                <RcProgressBar v-for="(value, key) in cwQueries"
                               :key="key"
                               @update:progress="updateProgress"
                               :queries="value"
                               :name="key"
                               :cohort-progress="cohortProgress"
                               :data-api-url="get_data_url"
                >
                </RcProgressBar>
              </div>
              <!--background request progress display-->
              <div v-else-if="isAsyncRequest && dataRequestLog != null" >
                <AsyncFormProgressBar
                    v-for="(value, key) in dataRequestLog"
                    :key="key"
                    :form-queries="value"
                >
                </AsyncFormProgressBar>

              </div>

              <Dialog
                  v-model:visible="confirmCancel"
                  max-width="500px"
                  modal
                  header="Cancel Data Retrieval"
              >
                <Message severity="warn" :closable="false">
                  Are you sure you want to exit?
                  <br>
                  Data that has already been saved to REDCap will not be deleted.
                </Message>
                <template #footer>
                  <Button
                      class="p-button-primary" size="small" icon="pi pi-check"
                      label="No, Continue"
                      @click="confirmCancel = false"
                  />
                  <Button
                      class="ml-2 p-button-danger" size="small" icon="pi pi-times"
                      label="Yes, Cancel"
                      outlined
                      @click="cancel()"
                  />
                </template>
              </Dialog>

              <Divider></Divider>
              <!--Button v-if="isAsyncRequest"
                      label="Project Home"
                      class="p-button-primary mr-2" size="small" icon="pi pi-home"
                      @click="goToUrl(project_setup_url)"
              /-->
              <Button v-if="totalProgress < 100 && !cancelled"
                      class="p-button-secondary" size="small" icon="pi pi-times"
                      label="Cancel Data Retrieval"
                      @click="confirmCancel = true"/>
              <Button v-else
                      label="Export Data Page"
                      class="p-button-primary" size="small" icon="pi pi-download"
                      @click="goToUrl(data_exports_url)"
              />
            </div>

            <Dialog
                v-model:visible="showSync"
                max-width="500px"
                modal
                :style="{ width: '40vw' }"
                header="Run in real time"
            >
              <Card style="box-shadow: none">
                <template #content>
                  <Message severity="warn" :closable="false">
                    DUSTER will attempt to retrieve and save data to this REDCap project in real time.
                    <br>
                    Please keep this browser tab open until the process completes.
                    <br>
                    If you close this browser tab, DUSTER will stop retrieving data.
                    <br>
                    Would you like to continue?
                  </Message>
                  <!--
                  <p>
                    This will launch the DUSTER process to get the data and populate the REDCap project in real time.
                    Please keep the current browser tab open till the processing completes.
                    If you close the current browser tab, it will stop processing and project will be left in inconsistent state.
                  </p>
                  <p class="mt-2">
                    Are you sure to launch the process in real time?
                  </p>
                  -->
                </template>
                <template #footer>
                  <Button
                      class="p-button-primary" size="small" icon="pi pi-check"
                      label="Yes, Launch"
                      @click="syncCohort()"
                  />
                  <Button
                      class="ml-2 p-button-secondary" size="small" icon="pi pi-times"
                      label="No, Cancel"
                      @click="showSync = false"
                  />
                </template>
              </Card>
            </Dialog>

            <Dialog
                v-model:visible="showAsyncNotify"
                max-width="500px"
                header="Run in Background"
            >
              <Card style="box-shadow: none">
                <template #content>
                  <p>
                    {{ asyncNotifyMessage }}
                  </p>
                  <InputText v-model="email">
                  </InputText>

                </template>
                <template #footer>
                  <Button
                      class="p-button-primary" size="small" icon="pi pi-check"
                      label="Submit"
                      @click="asyncRequestData()"
                  />
                  <Button
                      class="ml-2 p-button-secondary" size="small" icon="pi pi-times"
                      label="Cancel"
                      @click="showAsyncNotify = false"
                  />
                </template>
              </Card>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
  <SystemErrorDialog v-if="systemError" :exit-url="exit_url"/>
</template>
<script setup lang="ts">
import {ref, watch, computed, onMounted} from 'vue'

import axios from 'axios'
import MissingFieldsTable from "@/components/MissingFieldsTable.vue";
import RequestDataTable from "@/components/RequestDataTable.vue";
import RcProgressBar from "@/components/RcProgressBar.vue";
import AsyncFormProgressBar from "@/components/AsyncFormProgressBar.vue";
import SystemErrorDialog from '@shared/components/SystemErrorDialog.vue'
import {queryMessage, toTitleCase, formLabel} from "@/utils/helpers.js"
import {requiredIf, helpers} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const projectConfig = JSON.parse(localStorage.getItem('getDataObj') || '{}');
//console.log("getDataObj " + localStorage.getItem('getDataObj'))
localStorage.removeItem('getDataObj');

setInterval(() => {
  axios.get(projectConfig.refresh_session_url)
      .then(response => {
        console.log(response);
      }).catch(function (error) {
    console.log(error)
  });
},60000);

const dev = ref<boolean>(false)
const systemError = ref<boolean>(false)

const projectId = ref<string>(projectConfig.project_id)
const serverName = ref<string>(projectConfig.server_name)

const record_base_url = ref<string>(projectConfig.record_base_url)
const designer_url = ref<string>(projectConfig.designer_url)
const data_exports_url = ref<string>(projectConfig.data_exports_url)
const project_setup_url = ref<string>(projectConfig.project_setup_url)
const get_data_url = ref<string>(projectConfig.get_data_api)
const exit_url = ref<string>(projectConfig.exit_url)
//<?php echo $module->getUrl("services/getData.php?pid=$projectId&action=productionStatus"); ?>
const step = ref<number>(0)
const errorMessage = ref<string>("")
const saveMessage = ref<string>("Saving ...")
const cohortMessage = ref<string>("Researcher-Provided Information update in progress.")
const previousRequestStatus = ref<string>()
const startLoad = ref<boolean>(false)
const isProduction = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isLoaded = ref<boolean>(false)
const confirmCancel = ref<boolean>(false)
const cancelled = ref<boolean>(false) // used in case async request cancels
const cohortProgress = ref<number>(0)
const totalProgress = ref<number>(0)
const saveSize = ref<number>(0)
const maxCohortSize = ref<number>(projectConfig.max_cohort_size)
const numQueries = ref<number>(0)
const dusterData = ref<any>()
const cwQueries = ref<Object>()
const isAsyncRequest = ref<boolean>(false)
const asyncPollInterval = ref<number>(20)
const asyncPollLimit = ref<number>(100)
const showAsyncNotify = ref<boolean>(false)
const showSync = ref<boolean>(false)
const email = ref<string>(projectConfig.user_email)
const asyncNotifyMessage = ref<string>("Enter an email address to get notified when the data retrieval request is complete.")
const countDownUpdate = ref<string>("")
const updateTime = ref<string>("")

const selectedRecordsOptions = computed(() => {
  return [
    {name: 'All', disabled: false},
    {name: 'Sub-cohort', disabled: false}
  ]
});
const selectedRecordsOptionsDisabled = ref<boolean>(false)
const selectedRecordsOption = ref<any>();
const selectedRecordsMin = ref<number>()
const selectedRecordsMax = ref<number>()
// this is for table select which is currently disabled
const selectedRecords = ref<any>([])

const validationState = computed(() => {
  return {
    selectedRecordsMax: selectedRecordsMax.value,
    selectedRecordsMin: selectedRecordsMin.value
  }
})

const rules = computed(() => ({
  selectedRecordsMax: {
    requiredIf: helpers.withMessage('Required', requiredIf(selectedRecordsOption.value &&
    selectedRecordsOption.value.name == 'Sub-cohort'))
  },
  selectedRecordsMin: {
    requiredIf: helpers.withMessage('Required',
        requiredIf(selectedRecordsOption.value &&
    selectedRecordsOption.value.name == 'Sub-cohort'))
  }
}))

const v$ = useVuelidate(rules, validationState)

const runInRealtime = () => {
  v$.value.$touch()
  if (!v$.value.$error) {
    showSync.value = true
  }
}

const runInBackground = () => {
  v$.value.$touch()
  if (!v$.value.$error) {
    showAsyncNotify.value = true
  }
}

onMounted(async () => {
  // bypass the production status check for now
  // in future bypass the production status check if the server is localhost or contains "-dev" (i.e., a dev server)
  if (1 === 1 || serverName.value == "localhost" || serverName.value.includes("-dev")) {
    isProduction.value = true;
  } else { // check that project is in production status before getting data
    const prodResponse = await axios.get(get_data_url.value + "&action=productionStatus")
        .catch(function (error) {
          systemError.value = true
          errorMessage.value += error.message + '<br>';
        })
    if (!hasError(prodResponse)) {
      if (prodResponse?.data.production_status === 1) {
        isProduction.value = true;
      } else {
        errorMessage.value = "Please move this REDCap project to production status before requesting data.";
      }
    }
  }
})

/*
check status of previous getData requests.
If a synchronized request is in progress, do not start another one.
If an asynchronous request is in progress, show the async request progress & cancel button
If no request in progress, show status of previous request and get records to display
*/
watch (isProduction, async(prodStatus) => {
  if (prodStatus) {
    isLoading.value = true;
    const response = await axios.get(get_data_url.value + "&action=dataRequestStatus")
        .catch(function (error) {
          systemError.value = true;
          console.log("dataRequestStatus error");
          console.log(error);
          errorMessage.value += error.message + '<br>';
        })
    if (!hasError(response)) {
      //console.log(response)
      const previousCohort = (response?.data?.cohortRange == 'All') ? 'all records'
          : 'record ids ' + response?.data.cohortRange;
      if (response?.data?.dataRequestStatus == 'sync') {
        isLoading.value = false;
        errorMessage.value = '<p>A request to fetch data for '
            + previousCohort + ' in real time was submitted by '
            + response?.data.redcapUserName
          + ' and is in progress. Please wait for this request to complete before submitting a new request.';
      } else if (response?.data?.dataRequestStatus == 'async') {
        //console.log("dataRequestStatus async")
        isLoading.value = false;
        isLoaded.value = true;
        isAsyncRequest.value = true;
        step.value = 4;

        saveMessage.value = '<p>A request to fetch data for '
            + previousCohort + ' in the background was submitted by '
            + response?.data.redcapUserName
          + ' and is already in progress.</p><p>This page will check its status every '
          + asyncPollInterval.value +' seconds.</p>';
        asyncPollStatus(previousCohort);
      } else {
        if (response?.data?.dataRequestStatus && response?.data?.dataRequestStatus != 'no status') {
          const date = new Date( Date.parse(response?.data?.dataRequestTimestamp) );
          previousRequestStatus.value = 'Previous request status for ' + previousCohort + ': ' +
              response?.data.dataRequestStatus
              + ' at ' + date.toLocaleString('en-us')
        }
        startLoad.value = true
      }
    }
  }

})

watch(startLoad, async (start) => {
  if (start) {
    //console.log(get_data_url.value + "&action=cohort")
    axios.get(get_data_url.value + "&action=cohort").then
    (response => {
      //console.log(response)
      isLoading.value = false;
      isLoaded.value = true;
      if (!hasError(response)) {
        dusterData.value = response.data;
        //console.log(response.data);
        cwQueries.value = response.data.queries;
        numQueries.value = response.data.num_queries + 1;
        if (dusterData.value.rp_data.length > maxCohortSize.value) {
          selectedRecordsOptionsDisabled.value = true; // disable 'All'
          selectedRecordsOption.value = selectedRecordsOptions.value[1]; // select 'Sub-cohort'
        } else {
          selectedRecordsOption.value = selectedRecordsOptions.value[0]
          maxCohortSize.value = dusterData.value.rp_data.length
        }
        saveSize.value = 100 / numQueries.value;
        if (dusterData.value.missing_fields && dusterData.value.missing_fields.length > 0) {
          step.value = 1;
        } else if (!dusterData.value.rp_data ||
            (dusterData.value.missing_data != null && dusterData.value.missing_data.length > 0)) {
          step.value = 2;
        } else {
          step.value = 3;
        }
      }
    }).catch(function (error) {
      errorMessage.value += error.message + '<br>';
      systemError.value = true;
    });
  }
})

const goToUrl = (url:any) => {
  window.location = url;
}

const hasError = (response:any) => {
  if (response.status !== 200) {
    console.log('hasError status !== 200')
    console.log(response)
    errorMessage.value = response.message;
    return true;
  } else if (response.data?.status && response.data?.status !== 200) {
    console.log('hasError data.status != 200')
    console.log(response.data)
    errorMessage.value = response.data.message;
    if (response.data.status == 500) systemError.value = true;
    return true;
  } else {
    const data_str = JSON.stringify(response.data).toLowerCase()
    if (data_str.indexOf('error message') !== -1  ||
        data_str.indexOf('syntax error') !== -1 ||
        data_str.indexOf('fatal error') !== -1) {
      // this is usually a redcap or php level error
      console.log('hasError data.stringify contains error')
      console.log(data_str)
      errorMessage.value += data_str;
      systemError.value = true;
      axios.get(get_data_url.value + "&action=error&message=" + errorMessage.value);
      axios.get(get_data_url.value + "&action=logStatus&status=fail:Redcap EM error");
      return true;
    }
  }
  return false;
}

const cancel = () => {
  axios.get(get_data_url.value + "&action=logStatus&status=cancel")
  goToUrl(record_base_url.value)
}

const cohortStr = computed(() => {
  let str = 'all records'
    if (!isNaN((selectedRecordsMin.value === undefined) ? NaN : selectedRecordsMin.value)) {
      if (!isNaN((selectedRecordsMax.value === undefined) ? NaN : selectedRecordsMax.value)) {
      str = 'record ids ' + selectedRecordsMin.value + ' - ' +  selectedRecordsMax.value;
    } else {
        str = 'record ids >= ' + selectedRecordsMin.value;
      }
    } else if (!isNaN((selectedRecordsMax.value === undefined) ? NaN : selectedRecordsMax.value)) {
      str = 'record ids <= ' + selectedRecordsMax.value;

    }
  return str;
})

const findRecordIdIndex = (recordId: number) => {
  return dusterData.value.rp_data.findIndex((rpData:any) => rpData.redcap_record_id == recordId)
}

const updateCohortMax = (newMin:number) => {
  console.log('updateCohortMax min:' + newMin + " max:" + selectedRecordsMax.value
  + " maxCohortSize:" + maxCohortSize.value)
  if (newMin !== undefined
      && !isNaN(newMin)) {
    const minIndex = findRecordIdIndex(newMin)
    const calculated = maxCohortSize.value - 1 + parseInt(minIndex)
    const maxIndex = Math.min(dusterData.value.rp_data.length - 1, calculated)
    console.log('maxIndex' + maxIndex + ' minIndex' + minIndex + " calculated: " + calculated)
    selectedRecordsMax.value = dusterData.value.rp_data[maxIndex].redcap_record_id
  }
}

const updateCohortMin = (newMax:number) => {
  console.log('updateCohortMin min:' + selectedRecordsMin.value + " max:" + newMax
      + " maxCohortSize:" + maxCohortSize.value)
  if (newMax != undefined
      && !isNaN(newMax)) {
    const maxIndex = findRecordIdIndex(newMax)
    const calculated = 1 - maxCohortSize.value + parseInt(maxIndex)

    const minIndex = Math.max(0, calculated)
    console.log('minIndex' + minIndex + ' maxIndex' + maxIndex + " calculated: " + calculated)

    selectedRecordsMin.value = dusterData.value.rp_data[minIndex].redcap_record_id
  }
}

const selectedFilter = computed(() => {
  let filter = ""
  if (selectedRecordsOption.value.name == 'Sub-cohort') {
    /* this is for selecting from the table. disabled for now
    if (selectedRecords.value.length > 0 && selectedRecords.value.length < dusterData.value.rp_data.length) {
      let selected = "";
      console.log(selectedRecords.value)

      for (const record of selectedRecords.value) {
        console.log(record)
        //@ts-ignore
        selected += record.redcap_record_id + ","
      }
      selected = selected.slice(0, -1);
      filter = '&selected=' + selected;
    }*/
    if (!isNaN((selectedRecordsMin.value === undefined) ? NaN : selectedRecordsMin.value)) {
        filter += '&min=' + selectedRecordsMin.value
    }
    if (!isNaN((selectedRecordsMax.value === undefined) ? NaN : selectedRecordsMax.value)) {
      filter += '&max=' + selectedRecordsMax.value
    }
  }
  return filter;
});

const syncCohort = async() => {


    step.value = 4;
    showSync.value = false;
    try {
      const cohortSync = await axios.get(get_data_url.value + "&action=realTimeSyncCohort" + selectedFilter.value);

      if (!hasError(cohortSync)) {
        cohortProgress.value = 100;
        totalProgress.value = saveSize.value;
        saveMessage.value = "Researcher-Provided Information update for "
            + cohortStr.value + " complete.";
        cohortMessage.value = "Complete";
      } else {
        cohortMessage.value = "Error";
      }
    } catch (error: any) {
      errorMessage.value += error.message + '<br>';
      systemError.value = true
    }
}

const nextAsyncUpdateMessage = computed(()=> {
  let msg = ""
  if (totalProgress.value == 100) {
    return msg
  } else {
    if (updateTime.value.length > 0) {
      msg += 'Last update at: ' + updateTime.value + ". "
    }
    if (totalProgress.value < 100) {
      msg += countDownUpdate.value
    }
  }
  return msg
});

const updateProgress = (dataSync:any) => {
  console.log('updateProgress')
  console.log(dataSync)
  totalProgress.value += saveSize.value;
  if (dataSync.data.message.indexOf('Get Data Error') > -1) {
    let msg = 'Failed: ' + queryMessage(dataSync.data.query_name) + " request for " + dataSync.data.form
    if (dataSync.data.num_queries > 1 && (dataSync.data.num_complete) > 1) {
      msg += ". Some data has already been saved."
    }
    failures.value.push(msg)
  }
  if (dataSync.data.num_remaining) {
    totalProgress.value += dataSync.data.num_remaining * saveSize.value;
  }
  console.log('totalProgress ' + totalProgress.value)
  if (totalProgress.value > 99.5) {
    totalProgress.value = 100;
  }
  if (totalProgress.value === 100) {
    if (!hasError(dataSync)) {
      if (failures.value.length > 0) {
        errorMessage.value =
            "Data retrieval for " + cohortStr.value +
            " was incomplete. Some queries had failures. An email regarding this issue was sent to the DUSTER team.<br><br>"
            + failures.value.join('<br>');
        saveMessage.value = "";
        axios.get(get_data_url.value + "&action=logStatus&status=fail");
      } else {
        saveMessage.value = "Data retrieval complete for " + cohortStr.value;
        axios.get(get_data_url.value + "&action=logStatus&status=complete");
      }
    }  // else {hasError should handle error message}
  } else {
    saveMessage.value = toTitleCase(dataSync.data.message);
    if (failures.value.length > 0) {
      errorMessage.value = failures.value.join("<br>");
    }
  }

}

const asyncRequestData = async() => {
  v$.value.$touch()
  if (!v$.value.$error) {
    const emailParam = (email.value) ? '&email=' + email.value : false;
    if (!emailParam) {
      asyncNotifyMessage.value = "No email was entered. " + asyncNotifyMessage.value;
      showAsyncNotify.value = true;
    } else {
      isAsyncRequest.value = true;
      showAsyncNotify.value = false;
      step.value = 4;
      axios.get(get_data_url.value + "&action=asyncDataRequest" + emailParam + selectedFilter.value);
      saveMessage.value = "<p>A request to fetch data for " + cohortStr.value
          + " in the background was submitted.  An email will be sent to "
          + email.value
          + " when it is completed.</p><p>This page will check its status every " + asyncPollInterval.value + " seconds.</p>";
      await sleep(10000); // this is a hack because there is some lag in updating the requestId
      asyncPollStatus(cohortStr.value);
    }
  }
}

const sleepWithCountDown = async (milliseconds:number) => {
  let seconds = milliseconds/1000;
  for(let remaining = seconds; remaining > 0; remaining--) {
    countDownUpdate.value =  "Checking status again in " + remaining + " seconds.";
    await sleep(1000);
  }
}

const sleep = async (milliseconds:number) => {
  //console.log('start sleep')
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  });
};

const zeropad = (num:number) => {
  return ("00" + num).slice(-2)
}

const dataRequestLog = ref<any>()
const failures = ref<string[]>([])
const asyncPollStatus = async(cohortDesc:string) => {
  let complete = false;
  let count = 0; // count the number of status requests.  Used to set limit on number of requests.
  while (!complete) {
    count++;
    countDownUpdate.value = "Checking status...";
    let response = await axios.get(get_data_url.value + "&action=asyncDataLog")
        .catch(function (error) {
          complete = true;
          errorMessage.value += error.message + '<br>';
          systemError.value = true;
        });
    //console.log(response)
    if (!hasError(response) && response?.data && response.data.data_request_log) {
      const today = new Date();
      updateTime.value = zeropad(today.getHours()) + ":" + zeropad(today.getMinutes()) + ":" +
          zeropad(today.getSeconds());
      //if (response?.data) {
      dataRequestLog.value = response.data.data_request_log;
      //console.log("count " + count)
      cancelled.value = (response.data.request_status.message == 'cancel')
      const failed = (response.data.request_status.message.indexOf('fail') !== -1)
      let failMessages = ""

      //if (dataRequestLog.value) {
      if (cancelled.value) {
        complete = true
      } else if (failed) {
        complete = true
        failMessages = response.data.request_status.message
      } else {
        complete = true
        for (const formName in dataRequestLog.value) {
          complete = complete && (dataRequestLog.value[formName].complete ||
              dataRequestLog.value[formName].fail)
          if (dataRequestLog.value[formName].fail) {
            failMessages += "Data Retrieval Error: Unable to complete query '"
                + queryMessage(dataRequestLog.value[formName]['last_message'].substr(5))
                + "' for '" + formLabel(formName) + "'. ";
            if (dataRequestLog.value[formName].num_queries > 1 && dataRequestLog.value[formName].num_complete > 1) {
              failMessages += "Data was still saved from completed queries for this collection window.";
            }
            failMessages += '<br>'
          }
        }
        //complete = (response.data.num_queries > 0 && response.data.num_queries == response.data.num_complete)
        totalProgress.value = 100 * response.data.num_complete / response.data.num_queries
      }
      if (failMessages.length > 0) {
        errorMessage.value = failMessages
      }
      //}
    } else {
      // end due to error
      complete = true
    }

    if (!complete && count > asyncPollLimit.value) {
      //console.log("Hit async poll limit.");
      complete = true;
      // TODO add option to resume status updates
      errorMessage.value =
          "The max number of status updates has been reached. Click 'DUSTER: Get Data' link to continue to monitor this background request.";
    }
    if (!complete) {
      //console.log('not complete. sleep ' + asyncPollInterval.value + ' seconds')
      await sleepWithCountDown(asyncPollInterval.value * 1000);
      //console.log('stop sleep')
    }
  }
  countDownUpdate.value = "";
  if (totalProgress.value < 100) {
    totalProgress.value = 100
    saveMessage.value = ""
    errorMessage.value =
        "Data retrieval for " +  cohortDesc
        + " was incomplete. An email regarding the following query failures will be sent to the DUSTER team.<br><br>"
        + errorMessage.value;
  }
  if (cancelled.value) {
    saveMessage.value = "Data Retrieval Request for " +  cohortDesc
        + " Cancelled."
  } else {
    saveMessage.value = "Data Retrieval Request for " +  cohortDesc
        + " Completed."
  }
  //console.log("async complete")
}


</script>
