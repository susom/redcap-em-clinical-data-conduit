<template>
  <div class="grid mt-3">
    <div class="col-3"><b> {{ label }}: </b>
      <span v-if="message"><br>{{ message }}</span>
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
import {computed, capitalize} from "vue";
import type {PropType} from "vue";
import type {FormQueries} from "@/types/Query";

const props = defineProps({
  formQueries: {
    type: Object as PropType<FormQueries>,
    required: true
  }
})

const progress =  computed(()=> {
  var pctComplete=100* props.formQueries.num_complete / props.formQueries.num_queries
  if (isNaN(pctComplete))
    pctComplete = 0;
  else if (pctComplete > 99.5) {
    pctComplete = 100;
  }
  return pctComplete;
})

const label = computed(() => {
  return toTitleCase(props.formQueries.form_name);
})

const message = computed(() => {
  if (props.formQueries.complete) {
    return "Complete"
  }
  return queryLabel(props.formQueries.last_message) + " in progress.";
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

// remove the form name from the query label
const queryLabel = (str:string) => {
  const index = str.indexOf(":");
  const label = str.substr(index + 1);
  return toTitleCase(label.trim());
}

</script>

<style scoped>

</style>
