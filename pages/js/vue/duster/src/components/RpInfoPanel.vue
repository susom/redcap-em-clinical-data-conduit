<template>
  <div class="container">
    <Panel header="Researcher Provided Information">      
      <div>
        The minimum required information for each record is an MRN and a study enrollment date.
        This data must be loaded into redcap after DUSTER creates the project.
      </div>
      <Panel header="Identifier" class="mt-3">
        <DataTable
            :value="rpIdentifiers" class="p-datatable-sm"
        >
          <Column v-for="col of rpIdHeaders"
                  :key="col.value"
                  :field="col.value"
                  :header="col.text">
          </Column>
        </DataTable>
      </Panel>

      <Panel header="Dates" class="my-3">
        <DataTable
          :value="localRpDates"
          v-model:selection="localRpDatesEdit"
          class="p-datatable-sm"
          data-key="id"
        >
          <Column  key="redcap_field_type" field="redcap_field_type" header="Type">
            <template #editor="{ data, field }">
              <Dropdown v-model="data[field]" :options="dateTypes" />
            </template>
          </Column>
          <Column  key="label" field="label" header="Label">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column  key="redcap_field_name" field="redcap_field_name" header="Field Name">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>

          <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2 p-button-sm"
                      @click="editRpDate(slotProps.data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger" class=" p-button-sm"
                      :style="(slotProps.index == 0)? 'display:none !important' : ''"
                      @click="confirmDeleteRpDate(slotProps.data)" />
            </template>
          </Column>
          <template #footer>
            <div class="text-right">
              <Button label="New"
                      icon="pi pi-plus"
                      severity="success"
                      class="mr-2 p-button-sm"
                      @click="openNew" />          
            </div>                  
          </template>
        </DataTable>
      </Panel>
    </Panel>
  </div>

  <!-- edit rp_date dialog-->
  <Dialog v-model:visible="rpDateDialog"
          :style="{width: '450px'}"
          header="Researcher Provided Date"
          :modal="true"
          class="p-fluid">
    <div class="grid mt-3">
      <div class="col-2">
        <label>Format</label>
      </div>      
      <div class="col">
        <div class="flex flex-wrap gap-3">
          <div v-for="dateType in dateTypes" :key="dateType.value" class="flex align-items-center">
              <RadioButton
                  v-model="rpDate.redcap_field_type"
                  :inputId="dateType.value"
                  :id="dateType.value"
                  name="redcapFieldType"
                  :value="dateType.value" />
              <label :for="dateType.value" class="ml-2">{{ dateType.value }}</label>          
          </div>
        </div>
      </div>
    </div>
    <div class="field mt-2">
      <label for="label">Label</label>
      <InputText id="label"
                 v-model.trim="rpDate.label"
                 autofocus
                 :class="{'p-invalid': submitted && !rpDate.label.length}" />
      <small class="p-error" v-if="submitted && !rpDate.label.length">Label is required.</small>
    </div>
    <div class="field">
      <label for="redcapFieldName">REDCap Field Name</label>
      <InputText id="redcapFieldName"
                 v-model.trim="rpDate.redcap_field_name"
                 :class="{'p-invalid': submitted && !rpDate.redcap_field_name.length}" />
      <small class="p-error" v-if="submitted && !rpDate.redcap_field_name.length">REDCap field name is required
        .</small>
    </div>
    <input type="hidden" id="id" name="id" class="form-control" :value="rpDate.id">
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
      <Button label="Save" icon="pi pi-check" text @click="saveRpDate" />
    </template>
  </Dialog>

  <!-- confirm delete dialog -->
    <Dialog v-model:visible="deleteRpDateDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="rpDate">Are you sure you want to delete <b>{{rpDate.label}}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="deleteRpDateDialog = false"/>
          <Button label="Yes" icon="pi pi-check" text @click="deleteRpDate" />
        </template>
      </Dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {PropType} from 'vue'
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";

const props = defineProps({
  rpIdentifiers: {
    type: Object as PropType<FieldConfig[]>
  },
  rpDates: {
    type: Object as PropType<TimingConfig[]>
  }
})
const emit = defineEmits(
    ['deleteRpDate', 'updateRpDate', "update:rpDates"]
)

const rpIdHeaders = [
  {text: 'Label', value: 'label'},
  {text: 'REDCap field name', value: 'redcapFieldName'},
  {text: 'REDCap field type', value: 'redcapFieldType'}
]
const dateTypes = ref([
  {text: 'Date', value: 'date'},
  {text: 'Datetime', value: 'datetime'}
]);

const localRpDates = computed({
  get(){
    return props.rpDates;
  },
  set(value) {
    emit('update:rpDates', value)
  }
});

const localRpDatesEdit = ref<TimingConfig[]>([])

const rpDateDialog = ref(false);
const deleteRpDateDialog = ref(false);
const submitted = ref(false)

const newRpDate = () => {
  return JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
}
const rpDate = ref<TimingConfig>(newRpDate())

const openNew = () => {
  rpDate.value = newRpDate();
  submitted.value = false;
  rpDateDialog.value = true;
};

const addRpDate = () => {
  rpDate.value = newRpDate()
  if (localRpDates.value)
    localRpDates.value.push(rpDate.value)
}

const hideDialog = () => {
  rpDateDialog.value = false;
  submitted.value = false;
};
const saveRpDate = () => {
  submitted.value = true;
  rpDate.value.rp_date = rpDate.value.redcap_field_name
  if (localRpDates.value) {
    if (rpDate.value.id) {
      let index = findIndexById(rpDate.value.id, localRpDates.value)
      if (index > -1)
        localRpDates.value[index] = rpDate.value;
    } else {
      rpDate.value.id = (rpDate.value.redcap_field_name || "") + new Date().getTime()
      localRpDates.value.push(rpDate.value)
    }
    rpDateDialog.value = false;
    emit('updateRpDate', rpDate.value)
    rpDate.value = newRpDate();
  }
};
const editRpDate = (rpDateToEdit:TimingConfig) => {
  rpDate.value = {...rpDateToEdit};
  rpDateDialog.value = true;
};
const confirmDeleteRpDate = (rpDateToDelete:TimingConfig) => {
  rpDate.value = rpDateToDelete;
  deleteRpDateDialog.value = true;
};
const deleteRpDate = () => {
  if (localRpDates.value) {
    localRpDates.value = localRpDates.value.filter((val: TimingConfig) => val.id !==
        rpDate.value.id);
  }
    deleteRpDateDialog.value = false;
    rpDate.value = newRpDate();
}

const findIndexById = (id:string, datesArray:TimingConfig[]) => {
  let index = -1;
  if (datesArray) {
    for (let i = 0; i < datesArray.length; i++) {
      if (datesArray[i].id === id) {
        index = i;
        break;
      }
    }
  }
  return index;
};
</script>



<style scoped>

</style>
