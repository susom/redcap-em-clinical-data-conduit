<script setup lang="ts">
import {ref, inject, computed} from "vue";
  import type {ComputedRef} from "vue";
  import InputGroup from "primevue/inputgroup";
  import AutoComplete from 'primevue/autocomplete';

  // TODO for meds const medResults = inject('Results') as ComputedRef<any>;
  const medResults = ref([]); // TODO delete this line when above line TODO is completed

  const emit = defineEmits(['saveMform','closeMform']);

  const label = ref();

  const medications = ref<object[]>([]);

  const searchingMedications = ref(false);

  const filteredMedications = ref<object[]>([]);

  const selectedMedications = ref([]);

  const editingRows = ref<object[]>([]);

  const searchMedications = (event:any) => {
    searchingMedications.value = true;
    const query = event.query.trim();
    filteredMedications.value = medResults.value.filter((result:any) => result.label.toLowerCase().includes(query));
    searchingMedications.value = false;
  }

  const addRow = () => {
    const row = {
      id: Object.keys(medications.value).length + 1,
      label: "",
      medications: []
    }
    medications.value.push(row);
    editingRows.value.push(row);
  }

  const onRowEditSave = (event:any) => {
    let { newData, index } = event;
    medications.value[index] = newData;
  }

</script>

<template>
  <div class="mb-2">
    <p>
      Each medication added here creates a boolean clinical variable that answers this question - "In this data collection window, did the patient receive this medication?"
    </p>
    <p>
      Note that multiple medications may be added to each clinical variable.
    </p>
  </div>

  <div>
    {{ medications }}

  </div>
  <div>
    {{ editingRows }}
  </div>

  <DataTable
    class="mb-2"
    v-model:editingRows="editingRows"
    :value="medications"
    editMode="row"
    dataKey="id"
    @row-edit-save="onRowEditSave($event)"
    removableSort
  >
    <Column
      field="label"
      header="Label"
      sortable
      style="width: 20%"
    >
      <template #editor="{ data, field }">
        <InputText v-model="data[field]"/>
      </template>
    </Column>
    <Column
      field="medications"
      header="Medications"
      style="width: 65%"
    >
      <template #body="slotProps">
        <Chip
          v-for="med in slotProps.data.medications"
          :key="med"
          :label="med"
        />
      </template>
      <template #editor="{ data, field }">
        <InputGroup class="mb-2">
          <AutoComplete
              id="medications-input"
              v-model="data[field]"
              :multiple="true"
              :suggestions="filteredMedications"
              :virtualScrollerOptions="{itemSize:38, showLoader:true, lazy:true }"
              :loading="searchingMedications"
              @complete="searchMedications($event)"
              optionLabel="label"
              placeholder="Search">
          </AutoComplete>
        </InputGroup>
      </template>
    </Column>

    <Column
      :rowEditor="true"
      style="width: 10%"
    />
    <Column
        header=""
        style="width: 5%"
    >
      <template #body="slotProps">
        <Button
            icon="pi pi-trash"
            outlined
            rounded
            class="ml-2 p-1 small-icon"
            severity="danger"
            v-tooltip.top="'Delete'"
            @click=""
        >
        </Button>
      </template>
    </Column>
  </DataTable>


  <Button
    label="Add Medication"
    icon="pi pi-plus"
    severity="success"
    class="mr-2"
    @click="addRow()"
  >
  </Button>
  <Dialog
    modal
    header="Add New Medication"
    :closable="false"
    :style="{width:'80rem'}"
  >
    <div class="formgrid grid">
      <div>
        <label for="medications-input" class="font-bold block">Add medications</label>
        <small>Search for medications.</small>
        <InputGroup class="mb-2">
          <AutoComplete
              id="medications-input"
              v-model="selectedMedications"
              :multiple="true"
              :suggestions="filteredMedications"
              :virtualScrollerOptions="{itemSize:38, showLoader:true, lazy:true }"
              :loading="searchingMedications"
              @complete="searchMedications($event)"
              optionLabel="label"
              placeholder="Search">
          </AutoComplete>
        </InputGroup>

        <div class="mb-2">
          <label for="label" class="font-bold block mb-2">Label</label>
          <InputText
              id="label"
              v-model="label"
              autocomplete="off"
          />
        </div>

      </div>
    </div>
    <template #footer>
      <Button label="Submit" severity="primary" @click="" />
      <Button label="Cancel" severity="secondary" @click="emit('closeMform')" />
    </template>
  </Dialog>
</template>

<style scoped>

</style>