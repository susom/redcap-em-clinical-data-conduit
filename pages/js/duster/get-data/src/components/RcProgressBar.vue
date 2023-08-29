<template>
  <div class="grid mt-3">
       <div class="col-3"><b> {{ toTitleCase(name) }}: </b>
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
import {ref, watch, computed, capitalize} from "vue";
import type {PropType} from "vue";
import axios from 'axios';

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
      console.log(props.dataApiUrl + "&action=getData&query=" + JSON.stringify(props.queries[i]))
      const dataSync = await axios.get(props.dataApiUrl + "&action=getData&query="
          + JSON.stringify(props.queries[i]));
      numComplete.value++;
      emit('update:progress', dataSync)
      if (numComplete.value === numQueries.value) {
        updateMessage.value = "Complete";
      }
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
  return toTitleCase(props.name);
})

const toTitleCase = (str:string) => {
  const label = str.replace(/_/g, ' ')
  return label.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() +
            txt.substr(1).toLowerCase();
      }
  );
}

const queryLabel = (str:string) => {
  const index = str.indexOf(":");
  const label = str.substr(index + 1);
  return toTitleCase(label.trim());
}

</script>

<style scoped>

</style>
