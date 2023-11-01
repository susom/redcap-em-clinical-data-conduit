<template>
  <div class="grid">
    <div class="col-10">

      <div v-if="alertText" :class="'text-lg p-2 mb-1 font-italic mr-5 ' + alertTextStyle">{{alertText}}</div>
      <!-- NOTE: DataTable prop :totalRecords="totalRecords" not working -->
      <DataTable v-model:selection="selectedRows"
                 :value="tableRows" paginator :rows="10"
                 :rowsPerPageOptions="[10, 20, 50]"
                 tableStyle="min-width: 50rem" class="p-datatable-sm"
                 @update:selection="$emit('update:selectedRecords', selectedRows)"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="selectable"></Column>
        <!-- redcap_record_id hidden column is for easier selection -->
        <Column field="redcap_record_id" header="Record Id" :hidden=true></Column>

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
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import type {PropType} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  alertType: {
    type: String,
  },
  alertContent: {
    type: String,
  },
  recordBaseUrl: {
    type: String,
    required: true
  },
  tableData: {
    type: Array as PropType<Array<any>>,
    required: true
  },
  selectable: {
    type: Boolean
  },
  selectMin: {
    type: Number
  },
  selectMax: {
    type: Number
  },
  selectedRecordsMin: {
    type: Number
  },
  selectedRecordsMax: {
    type:Number
  }
})

const emit = defineEmits(['update:selectedRecords'])

const findRecordIdIndex = (recordId: number) => {
  return props.tableData.findIndex((rpData:any) => rpData.redcap_record_id == recordId)
}

const minIndex = computed(() => {
  if (props.selectedRecordsMin) {
    console.log("first " + findRecordIdIndex(props.selectedRecordsMin))
    return findRecordIdIndex(props.selectedRecordsMin)
  }
  return 0
})

const maxIndex = computed(() => {
  if (props.selectedRecordsMax) {
    console.log("max " + findRecordIdIndex(props.selectedRecordsMax))
    return findRecordIdIndex(props.selectedRecordsMax)
  }
  return props.tableData.length - 1
})

const totalRecords = computed(() => {
  console.log('totalRecords compute')
  if (props.selectedRecordsMax) {
    const maxIndex = findRecordIdIndex(props.selectedRecordsMax)
    console.log('maxIndex ' + maxIndex)

    if (minIndex.value) {
      const total = maxIndex - minIndex.value + 1
      console.log('result ' + total)
      return total
    } else {
      console.log('result ' + maxIndex)
      return maxIndex + 1
    }
  } else if (minIndex.value) {
    return props.tableData.length - minIndex.value
  }
  return undefined
})

const alertTextStyle = computed( () => {
  if (props.alertType == 'error')
    return 'text-red-500'
  else if (props.alertType == 'warn')
    return 'text-orange-500' ;
  else
    return 'text-primary' ;
})

const alertText = computed( () => {
  if (props.alertType == 'error')
    return 'ERROR: ' + props.alertContent ;
  else if (props.alertType == 'warn')
    return 'WARNING: ' + props.alertContent ;
  else
    return props.alertContent ;
})

const tableHeaders:any = computed(()=>{
      let dataObj;
      if (props.tableData != null && props.tableData[0] != null) {
        dataObj = props.tableData[0];
      } else {
        return;
      }
      let colHeaders = [
        {"text": "REDCap Record ID", "value": "redcap_record_id_url"},
        {"text": "MRN", "value": "mrn"}];
      for (let dateIndex in dataObj.dates) {
        colHeaders.push(
            {
              "text": dataObj.dates[dateIndex].label,
              "value": dataObj.dates[dateIndex].redcap_field_name
            });
      }
      return colHeaders;
})
const selectedRows = ref()
const metaKey = ref(true)


const tableRows:any = computed(()=>{
  let tablesRows = []
  if (props.tableData != null && props.tableData.length > 0) {
    for (let index in props.tableData) {
      if (parseInt(index) >= minIndex.value && parseInt(index) <= maxIndex.value) {
        let row: any = {};
        row["redcap_record_id"] = props.tableData[index].redcap_record_id
        row["redcap_record_id_url"] =
            '<a href="' + props.recordBaseUrl + '&arm=1&id=' +
            props.tableData[index].redcap_record_id + '">' +
            props.tableData[index].redcap_record_id + '</a>';
        row["mrn"] = props.tableData[index].mrn;
        for (let dateIndex in props.tableData[index].dates) {
          row[props.tableData[index].dates[dateIndex].redcap_field_name]
              = props.tableData[index].dates[dateIndex].value;
        }
        tablesRows.push(row);
      }
    }
  }
  return tablesRows
})
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
  color: #006CB8;
  background: #FFFFFF;
}
</style>
