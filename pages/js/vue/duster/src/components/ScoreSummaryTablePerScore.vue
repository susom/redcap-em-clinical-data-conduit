<!-- one table per score per Jonasel's original review tables-->
<template>
  <Panel :header="scoreLabel">
  <DataTable rowGroupMode="subheader" groupRowsBy="category" :value="thisScore"
  sortMode="single" sortField="category" :sortOrder="1"
  v-model:expandedRowGroups="expandedRows"
  expandableRowGroups>

  <template #groupheader="slotProps">
    <div class="flex align-items-center gap-2">
      <span>{{ slotProps.data.category }}</span>
    </div>
  </template>
  <Column field="category" header="Category"></Column>
  <Column field="label" header="Label"></Column>
  <Column field="redcap_field_name" header="REDCap Field Name"></Column>

  </DataTable>
  </Panel>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";

const props = defineProps({
  score: {
    type: Array,
    required: true
  },
  scoreLabel: String
})

const thisScore =  computed ({
  get(){
    return props.score
  },
  set(value) {
    emit("update:score", value)
  }
})

const label = computed(()=> {return props.scoreLabel})

const emit = defineEmits(
    ['update:score']
)

const expandedRows = ref()
const expanded = ref<boolean>(true)
const collapsed = ref<boolean>(false)


const expandAll = () => {
  expanded.value = true
  collapsed.value = false
  expandedRows.value = thisScore.value.filter((p:any) => p.redcap_field_name);
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
