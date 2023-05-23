<!-- one table per score per Jonasel's original review tables-->
<template>
  <Panel :header="scoreLabel">
  <DataTable rowGroupMode="subheader" groupRowsBy="category" :value="thisScore"
      sortMode="single" sortField="category" :sortOrder="1"
      v-model:expandedRowGroups="expandedRowGroups"
             expandableRowGroups
             @rowgroup-expand="collapsed = false"
             @rowgroup-collapse="expanded = false">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-0 text-900 font-bold">REDCap values</span>
        <span>
      <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
      <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
    </span>
      </div>
    </template>
  <template #groupheader="slotProps" >
    <span class="font-bold">
    {{ slotProps.data.category }}
      </span>
  </template>
  <Column field="" header=""></Column>
  <Column field="label" header="Label"></Column>
  <Column field="redcap_field_name" header="REDCap Field Name"></Column>

  </DataTable>
  </Panel>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";

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

const expandedRowGroups = ref(thisScore.value.map((p:any) => p.label));
const expanded = ref<boolean>(true)
const collapsed = ref<boolean>(false)

const expandAll = () => {
  collapsed.value = false
  expandedRowGroups.value = [];
  expandedRowGroups.value = thisScore.value.map((p:any) => p.label);
};
const collapseAll = () => {
  expanded.value = false
  expandedRowGroups.value = [];
};
</script>

<style scoped>

</style>
