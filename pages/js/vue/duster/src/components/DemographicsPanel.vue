<template>
  <Card>
    <template #title>Demographics</template>
    <template #content>
    <p>
          Select demographics below that you'd like to collect on your cohort.
          <br>
          <br>
          <em>Please bear in mind HIPAA Minimum Necessary when selecting identifying information.</em>
        </p>
    <div class="flex flex-column gap-3">
      <Panel header="Demographics">
      <ClinicalDataOptionsTable
        category="demographics"
        :options="demographicsOptions"
        :has-aggregates=false
        :columns=1
        v-model:selected-options="value"
      />
      </Panel>
  </div>
    </template>
  </Card>
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
