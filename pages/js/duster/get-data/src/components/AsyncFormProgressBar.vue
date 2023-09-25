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
import {computed} from "vue";
import type {PropType} from "vue";
import type {FormQueries} from "@/types/Query";
import { formLabel, queryMessage } from "@/utils/helpers.js"

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
  return formLabel(props.formQueries.form_name);
})

const message = computed(() => {
  return queryMessage(props.formQueries.last_message);
})

</script>

<style scoped>

</style>
