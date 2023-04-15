<!-- inline version of Rp Info, not currently used-->
<template>
  <Card>
    <template #title>
      Researcher Provided Information
    </template>
    <template #content>
      <div>
        <p>
          The minimum required information for each record is an MRN and a study enrollment date.
          This data must be loaded into redcap after DUSTER creates the project.
        </p>
      </div>
      <Panel header="Identifier">

        <DataTable
            :value="rpIdentifiers"
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
            editMode="row"
            v-model:editingRows="localRpDatesEditing"
            v-model:selection="localRpDatesEditing"
            data-key="id"
        >
          <Column  key="redcap_field_type" field="redcap_field_type" header="Type">
            <template #body="{ data, field }">
              <Dropdown v-model="data[field]" :options="dateTypes" optionLabel="text" optionValue="value"/>
            </template>
          </Column>
          <Column  key="label" field="label" header="Label">
            <template #body="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>
          <Column  key="redcap_field_name" field="redcap_field_name" header="Field Name">
            <template #body="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>

          <Column :exportable="false" style="min-width:3rem">
            <template #body="slotProps">
              <Button icon="pi pi-trash" outlined rounded severity="danger"
                      @click="confirmDeleteRpDate(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Toolbar class="mb-4">
          <template #end>
            <Button label="New"
                    icon="pi pi-plus"
                    severity="success"
                    class="mr-2"
                    @click="addRpDate" />
          </template>
        </Toolbar>
      </Panel>
    </template>
  </Card>

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

const localRpDatesEditing = ref<TimingConfig[]>([]);
const deleteRpDateDialog = ref(false);

const newRpDate = () => {
  return JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
}
const rpDate = ref<TimingConfig>(newRpDate())

const addRpDate = () => {
  rpDate.value = newRpDate()
  if (localRpDates.value)
    localRpDates.value.push(rpDate.value)
}

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
  //emit('deleteRpDate', rpDate.value)
  rpDate.value = newRpDate();
  //toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
}

</script>



<style scoped>

</style>
