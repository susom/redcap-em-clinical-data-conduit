<template>
  <DataTable v-model:expandedRows="expandedRows"
             :value="thisScore.subscores"
             dataKey="redcap_field_name"
             tableStyle="min-width: 50rem"
             sortField="label">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-0 text-900 font-bold">Subcores for {{ thisScore.label }} </span>
        <span>
                  <Button text icon="pi pi-plus" label="Expand All"
                          @click="localExpanded=true;localCollapsed=false" />
                  <Button text icon="pi pi-minus" label="Collapse All"
                          @click="localExpanded=false;localCollapsed=true" />
                </span>
      </div>
    </template>
    <Column expander style="width: 5rem" />
    <Column field="label" header="Label"></Column>
    <Column field="redcap_field_name" header="REDCap Field Name"></Column>
    <!--Column field="redcap_options" header="REDCap Options"></Column-->
    <template #expansion="slotProps">
          <DataTable :value="slotProps.data.dependencies"
                     dataKey="redcap_field_name"
                     tableStyle="min-width: 50rem">
            <Column style="width: 5rem" />
            <Column field="label" header="Label"></Column>
            <Column field="redcap_field_name" header="REDCap Field Name"></Column>
          </DataTable>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";

const props = defineProps({
  score: Object,
  expanded: Boolean,
  collapsed: Boolean
})

const thisScore =  computed<any> ({
  get(){
    return props.score
  },
  set(value) {
    emit("update:score", value)
  }
})

const emit = defineEmits(
    ['update:score']
)

//stores the expanded rows
const expandedRows = ref()

//expand and collapse all
const expandAll = () => {
  expandedRows.value = thisScore.value.subscores.filter((p:any) => p.redcap_field_name);
};
const collapseAll = () => {
  expandedRows.value = null;
};

const localExpanded = ref<boolean>(false)

const propsExpanded = computed<any> (()=>{
    return props.expanded
})
// this doesn't work (doesn't respond to parent prop
watch([propsExpanded, localExpanded],([newProps, newLocal]) =>
{
  if (newProps || newLocal) expandAll()
})

const localCollapsed = ref<boolean>(false)
const propsCollapsed = computed<any> (()=> {
      return props.collapsed
    }
)
watch([propsCollapsed, localCollapsed],([newProps, newLocal]) =>
{
  if (newProps || newLocal) collapseAll()
})


</script>

<style scoped>
:deep(.p-datatable-header .p-datatable-thead) {
  display: none !important
}
</style>
