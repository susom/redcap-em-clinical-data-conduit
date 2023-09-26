<template>
  <div class="container ml-0 mr-0 pr-0 pl-0">
    <div class="grid">
      <div class="col-10">
        <div class="projhdr"> DUSTER: Get data</div>
        <div>DUSTER will perform sanity check on the existing redcap records before it submits and asks for the data.</div>
        <div>You have two options on how you can get the data.
          <ul>
            <li>Run in real time -> This will launch the process is current browser and so you have to keep the browser tab open. Closing will stop the data fetching process.</li>
            <li>Run in background -> This submits the job and runs in the background. Browser can be safely closed. Notification will be sent in the email when completed.</li>
          </ul>
        </div>
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
                      alert-content="The following records are missing required researcher provided data.  You may still continue, but DUSTER may not be able to retrieve all possible data for these records."
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
                  <RequestDataTable
                      title='Data Records'
                      alert-type="info"
                      alert-content="DUSTER will attempt to get data for the following records:"
                      :record-base-url="record_base_url"
                      :table-data="dusterData.rp_data"
                  >
                  </RequestDataTable>
                </div>
                <div>
                  <Button
                      class="p-button-primary" size="small" icon="pi pi-caret-right"
                      label="Run in real time"
                      @click="showSync = true"
                  />
                  <Button
                      class="mx-2 p-button-primary" size="small" icon="pi pi-forward"
                      label="Run in background"
                      @click="showAsyncNotify = true"
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
              <Message :closeable="false" severity="warn" v-if="!isAsyncRequest && totalProgress < 100">
                Do not click on other links or close this browser
                tab/window until data request is complete.</Message>
              <p><strong>
                <span v-html="saveMessage"></span> <span v-html="nextStatusUpdateMessage"></span>
              </strong>
              </p>
              <div v-if="failures.length > 0">
                Query Failures
                <ul></ul>
                <li v-for="(value, key)  in failures" :key="key">
                  {{ value }}
                </li>
              </div>
              <!--synchronized request progress display-->
              <div class="text-left" v-if="!isAsyncRequest && dusterData.rp_data">
                <div class="grid">
                  <div class="col-3"><b>Researcher Provided Information:</b>
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
              <!--Button v-if="isAsyncRequest"
                      label="Project Home"
                      class="p-button-primary mr-2" size="small" icon="pi pi-home"
                      @click="goToUrl(project_setup_url)"
              /-->
              <Button v-if="totalProgress < 100 && !cancelled"
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
                v-model:visible="showSync"
                max-width="500px"
                modal
                :style="{ width: '40vw' }"
                header="Run in real time"
            >
              <Card>
                <template #content>
                  <Message severity="warn" :closable="false">
                    This will launch the DUSTER process to get the data and populate the REDCap project in real time.
                    Please keep the current browser tab open till the processing completes.
                    If you close the current browser tab, it will stop processing and project will be left in inconsistent state.
                    <br>
                    Are you sure to launch the process in real time?
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
  <SystemErrorDialog v-if="systemError"/>
</template>
<script setup lang="ts">
import {ref, watch, computed, onMounted} from 'vue'

import axios from 'axios'
import MissingFieldsTable from "@/components/MissingFieldsTable.vue";
import RequestDataTable from "@/components/RequestDataTable.vue";
import RcProgressBar from "@/components/RcProgressBar.vue";
import AsyncFormProgressBar from "@/components/AsyncFormProgressBar.vue";
import SystemErrorDialog from '@shared/components/SystemErrorDialog.vue'
import { toTitleCase } from "@/utils/helpers.js"

const projectConfig = JSON.parse(localStorage.getItem('getDataObj') || '{}');
console.log("getDataObj " + localStorage.getItem('getDataObj'))
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
//<?php echo $module->getUrl("services/getData.php?pid=$projectId&action=productionStatus"); ?>
const step = ref<number>(0)
const errorMessage = ref<string>("")
const saveMessage = ref<string>("Saving ...")
const cohortMessage = ref<string>("Researcher provided information update in progress.")
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
const numQueries = ref<number>(0)
const dusterData = ref<any>()
const cwQueries = ref<Object>()
const isAsyncRequest = ref<boolean>(false)
const asyncPollInterval = ref<number>(20)
const asyncPollLimit = ref<number>(100)
const showAsyncNotify = ref<boolean>(false)
const showSync = ref<boolean>(false)
const email = ref<string>(projectConfig.user_email)
const asyncNotifyMessage = ref<string>("Enter an email address to get notifications when data request is complete.")
const countDownUpdate = ref<string>("")
const updateTime = ref<string>("")

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
          console.log("dataRequestStatus error")
          console.log(error)
          errorMessage.value += error.message + '<br>';
        })
    if (!hasError(response)) {
      console.log(response)
      if (response?.data?.dataRequestStatus == 'sync') {
        isLoading.value = false;
        errorMessage.value = '<p>Real time Data Request initiated by ' + response?.data.redcapUserName +
            ' already in progress.  Please wait for this request to complete before submitting a new data request.'
      } else if (response?.data?.dataRequestStatus == 'async') {
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
        if (response?.data?.dataRequestStatus && response?.data?.dataRequestStatus != 'no status') {
          let date = new Date( Date.parse(response?.data?.dataRequestTimestamp) );

          previousRequestStatus.value = 'Previous request status: ' + response?.data.dataRequestStatus
              + ' at ' + date.toLocaleString('en-us')
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
    console.log('hasError status !== 200')
    console.log(response)
    errorMessage.value = response.message;
    return true;
  } else if (response.data?.status && response.data?.status !== 200) {
    console.log('hasError data.status != 200')
    console.log(response.data)
    errorMessage.value += response.data.message + '<br>';
    if (response.data.status == 500) systemError.value = true;
    return true;
  } else {
    console.log('hasError data.stringify contains error')
    const data_str = JSON.stringify(response.data).toLowerCase()
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

const cancel = () => {
  axios.get(get_data_url.value + "&action=logStatus&status=cancel")
  goToUrl(record_base_url.value)
}

const syncCohort = async() => {
  step.value = 4;
  showSync.value = false ;
  try {
    const cohortSync = await axios.get(get_data_url.value + "&action=realTimeSyncCohort");
    cohortProgress.value = 100;
    totalProgress.value = saveSize.value;
    if (!hasError(cohortSync)) {
      saveMessage.value = "Researcher Provided Information update complete.";
      cohortMessage.value = "Complete";
    }
  } catch (error:any) {
    errorMessage.value += error.message + '<br>';
    systemError.value = true
  }
}

const nextStatusUpdateMessage = computed(()=> {
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

  if (dataSync.data.numRemaining) {
    totalProgress.value += dataSync.data.numRemaining * saveSize.value;
  }
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
  } else { // there's an error
    if (totalProgress.value === 100) {
      errorMessage.value = "Some queries had failures.  Data save incomplete.<br><br>" + errorMessage.value
      saveMessage.value = ""
      axios.get(get_data_url.value + "&action=logStatus&status=fail");
    }
  }
}

const asyncRequestData = async() => {
  const emailParam = (email.value) ? '&email=' + email.value : false
  if (!emailParam) {
    asyncNotifyMessage.value = "No email value was entered. " + asyncNotifyMessage.value
    showAsyncNotify.value = true;
  } else {
    isAsyncRequest.value = true
    showAsyncNotify.value = false
    step.value = 4;
    axios.get(get_data_url.value + "&action=asyncDataRequest" + emailParam);
    saveMessage.value = "<p>Background Data request submitted.  An email will be sent to " + email.value +
        " when it is completed.</p><p>This view will request status every " + asyncPollInterval.value + " seconds.</p>";
    await sleep(10000); // this is a hack because there is some lag in updating the requestId
    asyncPollStatus();
  }
}

const sleepWithCountDown = async (milliseconds:number) => {
  let seconds = milliseconds/1000

  for(let remaining = seconds; remaining > 0; remaining--) {
    countDownUpdate.value =  remaining + " seconds until next update."
    await sleep(1000)
  }
}

const sleep = async (milliseconds:number) => {
  console.log('start sleep')
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  });
};

const zeropad = (num:number) => {
  return ("00" + num).slice(-2)
}

const dataRequestLog = ref<any>()
const failures = ref<string[]>([])
const asyncPollStatus = async() => {
  let complete = false
  let count = 0 // count the number of status requests.  Used to set limit on number of requests.
  while (!complete) {
    count++
    countDownUpdate.value = "Getting status ... "
    let response = await axios.get(get_data_url.value + "&action=asyncDataLog")
        .catch(function (error) {
          complete = true
          errorMessage.value += error.message + '<br>';
          systemError.value = true
        })
    if (!hasError(response) && response?.data && response.data.data_request_log) {
      const today = new Date();
      updateTime.value = zeropad(today.getHours()) + ":" + zeropad(today.getMinutes()) + ":" +
          zeropad(today.getSeconds());
      //if (response?.data) {
      dataRequestLog.value = response.data.data_request_log
      console.log("count " + count)
      console.log(response)
      cancelled.value = (response.data.request_status.message == 'cancel')

      //if (dataRequestLog.value) {
      if (cancelled.value) {
        complete = true
      } else {
        let failMessages = ""
        complete = true
        for (const formName in dataRequestLog.value) {
          complete = complete && (dataRequestLog.value[formName].complete ||
              dataRequestLog.value[formName].fail)
          if (dataRequestLog.value[formName].fail) {
            failMessages += toTitleCase(dataRequestLog.value[formName]['last_message'].substr(5)) + '<br>'
          }
        }
        //complete = (response.data.num_queries > 0 && response.data.num_queries == response.data.num_complete)
        totalProgress.value = 100 * response.data.num_complete / response.data.num_queries
        if (failMessages.length > 0) {
          errorMessage.value = failMessages
        }
      }
      //}
    } else {
      // end due to error
      complete = true
    }

    if (!complete && count > asyncPollLimit.value) {
      console.log("Hit async poll limit.");
      complete = true
      // TODO add option to resume status updates
      errorMessage.value =
          "The max number of status updates has been reached.  Click 'Duster: Get Data' link to continue to monitor this background request."
    }
    if (!complete) {
      console.log('not complete. sleep ' + asyncPollInterval.value + ' seconds')
      await sleepWithCountDown(asyncPollInterval.value * 1000)
      console.log('stop sleep')
    }
  }
  countDownUpdate.value = ""
  if (totalProgress.value < 100) {
    totalProgress.value = 100
    errorMessage.value = "Some queries had failures.  Data save incomplete.<br><br>" + errorMessage.value
  }
  if (cancelled.value) {
    saveMessage.value = "Data Request Cancelled."
  } else {
    saveMessage.value = 'Data Request Complete.'
  }
  console.log("async complete")
}

</script>
