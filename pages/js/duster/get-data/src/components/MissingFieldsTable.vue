<template>
  <div>

    <DataTable :value="tableRows" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex">
          <span class="text-xl text-900 font-bold">Missing REDCap Fields</span>
        </div>
        <Message severity="error">
          There are missing REDCap fields that are required by DUSTER.
          Please add the following REDCap fields to this project before proceeding
        </Message>
      </template>
      <Column
          v-for="col of tableHeaders"
          :key="col.value"
          :field="col.value"
          :header="col.text">
      </Column>
    </DataTable>
</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {PropType} from "vue";

const props = defineProps({
  tableData: {
    type: Array as PropType<Array<any>>,
    required: true
  }
})

const tableHeaders = [{"text": "Form", "value": "form"},
  {"text": "Field", "value": "field"},
  {"text": "Field Format", "value": "format"}]
const tableRows:any = computed(()=>{
  let tablesRows = []
  if (props.tableData != null && props.tableData.length > 0) {
  for (let index in props.tableData) {
    let row:any = {};
    row["form"] = props.tableData[index].form_label;
    row["field"] = props.tableData[index].label + ' ('+ props.tableData[index].redcap_field_name + ')';
    row["format"] = props.tableData[index].format;
    tablesRows.push(row);
  }
  return tablesRows;
}
return tableRows
})
</script>

<style scoped>

</style>
