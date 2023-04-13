<template>
  <div class="container">
    <Panel header="Demographics">
      <div>
        Select demographics below that you'd like to collect on your cohort.
          <br>
          <br>
          <em>Please bear in mind HIPAA Minimum Necessary when selecting identifying information.</em>        
      </div>
      <Panel header="Demographics" class="mt-3">
        <ClinicalDataOptionsTable
          category="demographics"
          :options="demographicsOptions"
          :has-aggregates=false
          :columns=1
          v-model:selected-options="value"
        />
      </Panel>      
    </Panel>
  </div>
</template>


<script setup lang="ts">
import {computed} from "vue"
import type {PropType} from 'vue'
import type FieldMetadata from "@/types/FieldMetadata"
import ClinicalDataOptionsTable from "./ClinicalDataOptionsTable.vue"

const props = defineProps({
  demographicsOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  demographicsSelects:
    Array as PropType<Array<FieldMetadata>>
})
const emit = defineEmits(['update:demographicsSelects'])
const value = computed({
  get() {
    return props.demographicsSelects
  },
  set(value) {
    emit('update:demographicsSelects', value)
  }
})

</script>

<style scoped>

</style>
