<template>
  <div>
    <DataTable :value="tableRows" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]"
               tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex">
          <span class="text-xl text-900 font-bold">{{ title }}</span>
        </div>
        <Message :severity="alertType"> {{ alertContent }}</Message>
      </template>
      <Column
          v-for="col of tableHeaders"
          :key="col.value"
          :field="col.value"
          :header="col.text">
        <template #body="{ data, field }">
          <span v-html="data[field]"></span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {PropType} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
    required: true
  },
  alertContent: {
    type: String,
    required: true
  },
  recordBaseUrl: {
    type: String,
    required: true
  },
  tableData: {
    type: Array as PropType<Array<any>>,
    required: true
  }
})

const tableHeaders:any = computed(()=>{
      let dataObj;
      if (props.tableData != null && props.tableData[0] != null) {
        dataObj = props.tableData[0];
      } else {
        return;
      }
      let colHeaders = [
        {"text": "REDCap Record id", "value": "redcap_record_id"},
        {"text": "MRN", "value": "mrn"}];
      for (let dateIndex in dataObj.dates) {
        colHeaders.push(
            {
              "text": dataObj.dates[dateIndex].redcap_field_name,
              "value": dataObj.dates[dateIndex].redcap_field_name
            });
      }
      return colHeaders;
})

const tableRows:any = computed(()=>{
  let tablesRows = []
  if (props.tableData != null && props.tableData.length > 0) {
    for (let index in props.tableData) {
      let row:any = {};
      row["redcap_record_id"] =
          '<a href="' +props.recordBaseUrl+'&arm=1&id=' +
          props.tableData[index].redcap_record_id  +'">' +
          props.tableData[index].redcap_record_id + '</a>';
      row["mrn"] = props.tableData[index].mrn;
      for (let dateIndex in props.tableData[index].dates) {
        row[props.tableData[index].dates[dateIndex].redcap_field_name]
            = props.tableData[index].dates[dateIndex].value;
      }
      tablesRows.push(row);
    }
  }
  return tablesRows
})
</script>

<style scoped>

</style>
