<template>
  <div class="container">
    <div class="grid">
      <div class="col-offset-1 col-10">
        <DusterHeader></DusterHeader>
        <Panel header="DUSTER: Get Data">

          <div v-if="errorMessage">
            <Message severity="error"><span v-html="errorMessage"></span></Message>
            <!-- display button to Project Setup if error is due to production status -->
            <Button
                v-if="!isProduction"
                class="p-button-primary" size="small" icon="pi pi-cog"
                label="Project Setup"
                @click="goToUrl(project_setup_url)"
            />
          </div>

          <div>

            <p class="text-center" v-if="isLoading && !isLoaded">
              Loading <i class="pi pi-spin pi-spinner" style="font-size: 2rem;color: dodgerblue"></i>
            </p>

            <div v-if="isLoaded">
              <div v-if="step ==1 && dusterData.missing_fields">
                <Card>
                  <template #content>
                    <MissingFieldsTable
                        :table-data="dusterData.missing_fields">
                    </MissingFieldsTable>
                  </template>

                  <template #footer>
                    <Button
                        class="p-button-primary" size="small" icon="pi pi-cog"
                        label="Project Setup"
                        @click="goToUrl(designer_url)"/>
                  </template>
                </Card>
              </div>
              <div v-if="step==2">
                <Card>
                  <template #content>
                    <div v-if="!dusterData.missing_data && !dusterData.rp_data">
                      <Message severity="danger">
                        Your REDCap project contains no records. Add at least one record to your project in order to proceed.
                      </Message>
                    </div>
                    <div v-else-if="dusterData.missing_data">
                      <RequestDataTable
                          title='Missing Researcher-Provided Information'
                          alert-type="warn"
                          alert-content="The following records are missing required researcher provided data.  You may still continue, but DUSTER may not be able to retrieve all possible data for these records."
                          :record-base-url="record_base_url"
                          :table-data="dusterData.missing_data"
                      >
                      </RequestDataTable>
                    </div>
                  </template>
                  <template #footer>
                    <Button v-if="dusterData.rp_data"
                            label="Continue"
                            class="p-button-primary" size="small" icon="pi pi-caret-right"
                            @click="step = 3"
                    />

                    <Button text outlined @click="goToUrl(record_base_url)"
                            class="p-button-secondary" size="small" icon="pi pi-times"
                            label="Cancel"
                    />
                  </template>
                </Card>
              </div>

              <div v-if="step == 3">
                <Message severity="info" v-if="previousRequestStatus">
                  {{ previousRequestStatus }}
                </Message>
                <Card v-if="dusterData.rp_data">
                  <template #content>
                    <RequestDataTable
                        title='Data Records'
                        alert-type="info"
                        alert-content="DUSTER will attempt to get data for the following records:"
                        :record-base-url="record_base_url"
                        :table-data="dusterData.rp_data"
                    >
                    </RequestDataTable>
                  </template>
                  <template #footer>
                    <Button
                        class="p-button-primary" size="small" icon="pi pi-caret-right"
                        label="Run in real time"
                        @click="syncCohort()"
                    />
                    <Button
                        class="mx-2 p-button-primary" size="small" icon="pi pi-forward"
                        label="Run in background"
                        @click="showAsyncNotify = true"
                    />
                    <Button
                        class="p-button-secondary" size="small" icon="pi pi-times"
                        label="Cancel"
                        @click="goToUrl(project_setup_url)"
                    />
                  </template>
                </Card>

              </div>

              <div v-if="step == 4">
                <p><strong>
                  <span v-html="saveMessage"></span>
                </strong>
                </p>
                <!--synchronized request progress display-->
                <div class="text-center" v-if="!isAsyncRequest && dusterData.rp_data">
                  <div class="grid">
                    <div class="col-3"><b>Cohort:</b>
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
                    header="Cancel"
                >
                  <Message severity="warn" :closable="false">
                    Are you sure you want to exit data retrieval?
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
                <Button v-if="isAsyncRequest"
                        label="Project Home"
                        class="p-button-primary mr-2" size="small" icon="pi pi-home"
                        @click="goToUrl(project_setup_url)"
                />
                <Button v-if="totalProgress < 100"
                        class="p-button-secondary" size="small" icon="pi pi-times"
                        label="Cancel Data Request"
                        @click="confirmCancel = true"/>
                <Button v-else
                        label="Export Data Page"
                        class="p-button-primary" size="small" icon="pi pi-download"
                        @click="goToUrl(data_exports_url)"
                />
              </div>
              <Dialog
                  v-model:visible="showAsyncNotify"
                  max-width="500px"
                  header="Run in Background"
              >
                <Card>
                  <template #content>
                    <p>
                      Enter an email address to get
                      notifications when data request is
                      complete.
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
        </Panel>
      </div>
    </div>
  </div>
  <SystemErrorDialog v-if="systemError"/>
</template>
<script setup lang="ts">
import {ref, watch, onMounted} from 'vue'

import axios from 'axios'
import MissingFieldsTable from "@/components/MissingFieldsTable.vue";
import RequestDataTable from "@/components/RequestDataTable.vue";
import RcProgressBar from "@/components/RcProgressBar.vue";
import AsyncFormProgressBar from "@/components/AsyncFormProgressBar.vue";
import SystemErrorDialog from '@shared/components/SystemErrorDialog.vue'
import DusterHeader from '@shared/components/DusterHeader.vue'
import type {FormQueries} from '@/types/Query'

const projectConfig = JSON.parse(localStorage.getItem('getDataObj') || '{}');
console.log("getDataObj " + localStorage.getItem('getDataObj'))
localStorage.removeItem('getDataObj');
const dev = ref<boolean>(false)
const systemError = ref<boolean>(false)

const projectId = ref<string>(projectConfig.project_id)
const serverName = ref<string>(projectConfig.server_name)

const record_base_url = ref<string>(projectConfig.record_base_url)
const designer_url = ref<string>(projectConfig.designer_url)
const data_exports_url = ref<string>(projectConfig.data_exports_url)
const project_setup_url = ref<string>(projectConfig.project_setup_url)
const get_data_url = ref<string>(projectConfig.get_data_api)
//<?php echo $module->getUrl("services/getData.php?pid=$projectId&action=productionStatus"); ?>
const step = ref<number>(0)
const errorMessage = ref<string>()
const saveMessage = ref<string>("Saving ...")
const cohortMessage = ref<string>("Cohort sync in progress.")
const previousRequestStatus = ref<string>()
const startLoad = ref<boolean>(false)
const isProduction = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isLoaded = ref<boolean>(false)
const confirmCancel = ref<boolean>(false)
const cohortProgress = ref<number>(0)
const totalProgress = ref<number>(0)
const saveSize = ref<number>(0)
const numQueries = ref<number>(0)
const dusterData = ref<any>()
const cwQueries = ref<Object>()
const isAsyncRequest = ref<boolean>(false)
const asyncPollInterval = ref<number>(20)
const asyncPollLimit = ref<number>(100)
const showAsyncNotify = ref<boolean>(false)
const email = ref<string>(projectConfig.user_email)

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
          systemError.value = true
          errorMessage.value += error.message + '<br>';
        })
    if (!hasError(response)) {
      console.log(response)
      if (response?.data.dataRequestStatus === 'sync') {
        isLoading.value = false;
        errorMessage.value = '<p>Real time Data Request initiated by ' + response?.data.redcapUserName +
            ' already in progress.  Please wait for this request to complete before submitting a new data request.'
      } else if (response?.data.dataRequestStatus === 'async') {
        console.log("dataRequestStatus async")
        isLoading.value = false;
        isLoaded.value = true
        isAsyncRequest.value = true
        step.value = 4
        saveMessage.value = '<p>Background Data Request initiated by ' + response?.data.redcapUserName +
                ' already in progress.</p><p>This view will update status every '+
            asyncPollInterval.value +' seconds.</p>'
        asyncPollStatus()
      } else {
        if (response?.data.dataRequestStatus && response?.data.dataRequestStatus !== 'no status') {
          let date = new Date( Date.parse('2012-01-26T13:51:50.417-07:00') );

          previousRequestStatus.value = 'Previous request status: ' + response?.data.dataRequestStatus + ' at ' +
              date.toLocaleString('en-us')
        }
        startLoad.value = true
      }
    }
  }

})

watch(startLoad, async (start) => {
  if (start) {
    console.log(get_data_url.value + "&action=cohort")
    axios.get(get_data_url.value + "&action=cohort").then
    (response => {
      console.log(response)
      isLoading.value = false;
      isLoaded.value = true;
      if (!hasError(response)) {
        dusterData.value = response.data;
        console.log(response.data);
        cwQueries.value = response.data.queries;
        numQueries.value = response.data.num_queries + 1
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
      systemError.value = true
    });
  }
})

const goToUrl = (url:any) => {
  window.location = url;
}

const hasError = (response:any) => {
  if (response.status !== 200) {
    errorMessage.value = response.message;
    return true;
  } else if (response.data.status && response.data.status !== 200) {
    errorMessage.value += response.data.message + '<br>';
    return true;
  } else {
    const data_str = JSON.stringify(response.data).toLowerCase();
    if (data_str.indexOf('error message') !== -1  ||
        data_str.indexOf('syntax error') !== -1 ||
        data_str.indexOf('fatal error') !== -1) {
      errorMessage.value += data_str;
      //console.log("error:" + data_str);
      return true;
    }
  }
  return false;
}

const toTitleCase = (str:string) => {
  str = str.replace(/_/g,' ')
  return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase();
      }
  );
}

const cancel = () => {
  axios.get(get_data_url.value + "&action=logStatus&status=cancel")
  goToUrl(record_base_url.value)
}

const syncCohort = async() => {
  step.value = 4;
  try {
    const cohortSync = await axios.get(get_data_url.value + "&action=syncCohort");
    cohortProgress.value = 100;
    totalProgress.value = saveSize.value;
    if (!hasError(cohortSync)) {
      saveMessage.value = "Cohort sync complete.";
      cohortMessage.value = "Complete";
    }
  } catch (error:any) {
    errorMessage.value += error.message + '<br>';
    systemError.value = true
  }
}

const updateProgress = (dataSync:any) => {
  totalProgress.value += saveSize.value;
  console.log('totalProgress ' + totalProgress.value)
  if (totalProgress.value > 99.5) {
    totalProgress.value = 100;
  }
  if (!hasError(dataSync)) {
    if (totalProgress.value === 100) {
      saveMessage.value = "Data save complete";
      axios.get(get_data_url.value + "&action=logStatus&status=complete");
    } else {
      saveMessage.value = toTitleCase(dataSync.data.message);
    }
  }
}

const asyncRequestData = async() => {
  isAsyncRequest.value = true
  showAsyncNotify.value = false
  step.value = 4;
  const emailParam = (email.value) ? '&email=' + email.value : ''
  axios.get(get_data_url.value + "&action=asyncDataRequest" + emailParam);
  saveMessage.value = "<p>Background Data request submitted.  An email will be sent to " + email.value +
      " when it is completed.</p><p>This view will update status every "+ asyncPollInterval.value +" seconds.</p>";
  await sleep(asyncPollInterval.value * 1000)
  asyncPollStatus()
}

const sleep = async (milliseconds:number) => {
  console.log('start sleep')
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  });
};

const dataRequestLog = ref<any>()
const asyncPollStatus = async() => {
  let complete = false
  let count = 0 // count the number of status requests.  Used to set limit on number of requests.
  while (!complete) {
    count++
    const response = await axios.get(get_data_url.value + "&action=asyncDataLog")
        .catch(function (error) {
          complete = true
          errorMessage.value += error.message + '<br>';
          systemError.value = true
        })
    if (response?.data) {
      dataRequestLog.value = response.data.data_request_log
      console.log("count " + count)
      console.log(response)

      if (dataRequestLog.value) {
        let formComplete = true
        for (const formName in dataRequestLog.value){
          if (!dataRequestLog.value[formName].complete){
            formComplete = false
          }
        }
        complete = (response.data.num_queries > 0 && response.data.num_queries == response.data.num_complete)
        totalProgress.value = 100 * response.data.num_complete / response.data.num_queries
      }
      if (count > asyncPollLimit.value) {
        console.log("Hit async poll limit.");
        complete = true
      }
      if (!complete) {
        console.log('not complete. sleep ' + asyncPollInterval.value + ' seconds')
        await sleep(asyncPollInterval.value * 1000)
        console.log('stop sleep')
      }
    }
  }
  saveMessage.value = 'Data Request Complete.'
  console.log("async complete");
}

</script>
