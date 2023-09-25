<template>
  <div class="grid mt-3">
       <div class="col-3"><b> {{ label }}: </b>
             <span v-if="updateMessage"><br>{{ updateMessage }}</span>
         </div>
       <div class="col-8">
             <ProgressBar
                 :value="progress"
                 height="25"
              >
                 <strong>{{ Math.ceil(progress) }}%</strong>
             </ProgressBar>
         </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed} from "vue";
import type {PropType} from "vue";
import axios from 'axios';
import { toTitleCase, queryLabel, formLabel } from "@/utils/helpers.js"

const props = defineProps({
  queries: {
    type: Object as PropType<any>,
    required: true
  },
  dataApiUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cohortProgress: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:progress'])

const numComplete = ref<number>(0)
const updateMessage = ref<string>()
const localCohortProgress = computed(()=> {
  return props.cohortProgress
})

watch(localCohortProgress, async (updatedCohort) => {
  console.log(props.queries)
  if (updatedCohort === 100) {
    for (var i = 0; i < numQueries.value; i++) {
      updateMessage.value = queryLabel(props.queries[i].query_label) + " in progress.";
      console.log(props.dataApiUrl + "&action=realTimeDataRequest&query=" + JSON.stringify(props.queries[i]))
      const dataSync = await axios.get(props.dataApiUrl + "&action=realTimeDataRequest&query="
          + JSON.stringify(props.queries[i]));
      numComplete.value++;
      if (dataSync.data.message && dataSync.data.message.indexOf('Error') > -1) {
        updateMessage.value = "Fail";
        dataSync.data['numRemaining'] = numQueries.value - numComplete.value
        emit('update:progress', dataSync) // need this before the break
        break
      } else if (numComplete.value === numQueries.value) {
        updateMessage.value = "Complete";
      }
      emit('update:progress', dataSync)

    }
  }
})

const numQueries = computed(() => {
  return props.queries?.length ?? 0;
})

const progress =  computed(()=> {
  var pctComplete=100* numComplete.value / numQueries.value;
  if (isNaN(pctComplete))
    pctComplete = 0;
  else if (pctComplete > 99.5) {
    pctComplete = 100;
  }
  return pctComplete;
})

const label = computed(() => {
  return formLabel(props.name);
})

</script>

<style scoped>

</style>
