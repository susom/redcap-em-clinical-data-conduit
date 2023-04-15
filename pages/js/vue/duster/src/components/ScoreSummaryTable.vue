<template>
  <DataTable v-model:expandedRows="expandedRows" :value="thisScores"
         dataKey="redcap_field_name"
         tableStyle="min-width: 50rem"
             sortField="label"
  >
<template #header>
  <div class="flex flex-wrap align-items-center justify-content-between gap-2">
    <span class="text-0 text-900 font-bold">Scores</span>
    <span>
      <Button text icon="pi pi-plus" label="Expand All" @click="expanded = true" />
      <Button text icon="pi pi-minus" label="Collapse All" @click="collapsed = true" />
    </span>
  </div>
</template>
<Column expander style="width: 5rem" />
<Column field="label" header="Label"></Column>
<Column field="redcap_field_name" header="REDCap Field Name"></Column>
<!--Column field="redcap_options" header="REDCap Options"></Column-->

<template #expansion="slotProps">
    <SubscoreSummaryTable
        v-model:score="thisScores[slotProps.index]"
        :expanded="expanded"
        :collapsed="collapsed"
    />
</template>
  </DataTable>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import SubscoreSummaryTable from "@/components/SubscoreSummaryTable.vue";

const props = defineProps({
  scores: {
    type: Array,
    required: true
  }
})

const thisScores =  computed ({
  get(){
      return props.scores
  },
  set(value) {
      emit("update:scores", value)
  }
})

const emit = defineEmits(
    ['update:scores']
)

const expandedRows = ref()
const expanded = ref<boolean>(true)
const collapsed = ref<boolean>(false)


const expandAll = () => {
  expanded.value = true
  collapsed.value = false
  expandedRows.value = thisScores.value.filter((p:any) => p.redcap_field_name);
};
const collapseAll = () => {
  expanded.value = false
  collapsed.value = true
  expandedRows.value = null;
};

watch(expanded, (newExp) => {
  if (newExp) {
    collapsed.value = false
    expandAll()}
})
watch(collapsed, (newExp) => {
  if (newExp) {
    expanded.value = false
    collapseAll()}
})
</script>

<style scoped>

</style>
