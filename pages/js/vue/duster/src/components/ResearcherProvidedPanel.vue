<!-- inline version of Rp Info, not currently used-->
<template>

  <Panel header="Researcher Provided Information">
    <div>      
        The minimum required information for each record is an MRN and a study enrollment date.      
        This data must be loaded into REDcap after DUSTER creates the project.
    </div>
    <div class="col-12 mt-1">
        <DataTable
            :value="localRpProvidedData"
            class="p-datatable-sm"
            data-key="id">
          <Column
              key="value_type"
              field="value_type"
              header="Type">
            <template #body="slotProps">

              <!--Dropdown
                  v-if="localRpProvidedData[slotProps.index].value_type != 'Identifier'"
                  v-model="data[field]"
                  :options="dateTypes"
                  optionLabel="text"
                  optionValue="value"
                  class="w-full md:w-6rem"
              /-->
            <!-- md:w-6rem -->
              <DropdownWithValidation
                  v-if="localRpProvidedData[slotProps.index].value_type != 'Identifier'"
                  v-model="localRpProvidedData[slotProps.index].value_type"
                  :name="`localRpProvidedData[${slotProps.index}].value_type`"
                  :options="dateTypes"
                  option-label="text"
                  option-value="dtValue"
                  :class-def="'w-full'" 
                  placeholder="Select a type"
                  rules="required"
              />
              <!-- recommended method of handleChange was not working -->
              <!--Field v-slot="{ field, errorMessage }"
                     v-if="localRpProvidedData[slotProps.index].value_type != 'Identifier'"
                     :name="`localRpProvidedData[${slotProps.index}].value_type`"
                     v-model="localRpProvidedData[slotProps.index].value_type"
                     class="w-full md:w-6rem"
                     rules="required"
              >
                <Dropdown
                    v-bind="field"
                    :options="dateTypes"
                    :class="['w-full md:w-6rem',{ 'p-invalid': errorMessage }]"
                    :modelValue="field.value"
                    optionLabel="text"
                    optionValue="dtValue"
                    placeholder="Select a type"
                    @input="field.onInput.forEach((fn) => fn($event.value))"
                    @change="field.onChange.forEach((fn) => fn($event.value))"                />
                <small class="p-error" id="type-missing-error">{{ errorMessage || '&nbsp;' }}</small>

              </Field-->
              <span v-else>{{slotProps.data.value_type}}</span>
            </template>
          </Column>
          <Column
              key="label"
              field="label"
              header="Label">
            <template
                #body="slotProps">
              <InputTextRequired
                  :name="`localRpProvidedData[${slotProps.index}].label`"
                  v-model="slotProps.data[slotProps.field]"
                  classDef="w-full"
                  rules="required"
              />
            </template>
          </Column>
          <Column
              key="redcap_field_name"
              field="redcap_field_name"
              header="Field Name"
              >
            <template
                #body="slotProps">
              <InputTextRequired
                  :name="`localRpProvidedData[${slotProps.index}].redcap_field_name`"
                   v-model="localRpProvidedData[slotProps.index].redcap_field_name"
                  classDef="w-full"
                  :rules="{required: true,
                  redcap_field_name:true,
                  not_one_of:otherFieldNames(slotProps.index)}"
              />
            </template>
          </Column>
          <Column
              :exportable="false"
              header="Actions">
            <template
                #body="slotProps">                 
                <i class="pi pi-trash mr-2" 
                    v-if="(slotProps.index > 1)"
                    style="color:green;font-size:1.25em"
                    @click="confirmDeleteRpDate(slotProps.data)" />

                <i class="pi pi-plus-circle" 
                    style="color:green;font-size:1.25em"
                    @click="addRpDate" />                
                <!--
              <Button
                  icon="pi pi-trash"
                  outlined
                  rounded
                  size="small"
                  severity="danger"
                  :class="(slotProps.index < 2)? 'hidden' : 'mr-2'"
                  @click="confirmDeleteRpDate(slotProps.data)" />
              <Button
                  icon="pi pi-plus"
                  outlined
                  rounded
                  size="small"
                  severity="success"
                  :class="(slotProps.index == (localRpProvidedData.length -1) )? '': 'hidden'"
                  @click="addRpDate" >
              </Button>
              -->
            </template>
          </Column>
        </DataTable>

      </div>
  </Panel>
  <Dialog
      v-model:visible="deleteRpDateDialog"
      :style="{width: '450px'}"
      header="Confirm"
      :modal="true">
    <div class="confirmation-content mt-2 mb-4">
      <i class="pi pi-exclamation-triangle mr-3"
         style="font-size: 2rem" />
      <span
          v-if="rpDate">
        Are you sure you want to delete <b>{{rpDate.label}}</b>?
      </span>
    </div>
    <template #footer>
      <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteRpDateDialog = false"/>
      <Button
          label="Yes"
          icon="pi pi-check"
          text
          @click="deleteRpDate" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import type {PropType} from 'vue'
import type {BasicConfig} from "@/types/FieldConfig";
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import {Field} from 'vee-validate'
import InputTextRequired from "./InputTextWithValidation.vue";
import DropdownWithValidation from "./DropdownWithValidation.vue";
import {INIT_BASIC_CONFIG} from "@/types/FieldConfig";
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';


const props = defineProps({
  rpProvidedData: {
    type: Object as PropType<BasicConfig[]>,
    required: true
  },
  reservedFieldNames : {
      type: Array as PropType<string[]>,
      required:true
    }
})
const emit = defineEmits(
    ['updateRpDate','update:rpProvidedData','deleteRpDate']
)
//defineRule('required', required);

const dateTypes = ref([
  {text: 'Date', dtValue: 'date'},
  {text: 'Datetime', dtValue: 'datetime'}
]);

const localRpProvidedData = computed({
  get(){
    return props.rpProvidedData;
  },
  set(value) {
    emit('update:rpProvidedData', value)
  }
});
const localRpDatesEditing = ref<BasicConfig[]>([]);

const deleteRpDateDialog = ref(false);

const newRpDate = () => {
  return {...INIT_BASIC_CONFIG}
}
const rpDate = ref<BasicConfig>(newRpDate())

const addRpDate = () => {
  rpDate.value = newRpDate()
  rpDate.value.id = (rpDate.value.redcap_field_name || "") + new Date().getTime()

  if (localRpProvidedData.value)
    localRpProvidedData.value.push(rpDate.value)
}

const confirmDeleteRpDate = (rpDateToDelete:BasicConfig) => {
  rpDate.value = rpDateToDelete;
  deleteRpDateDialog.value = true;
};

const deleteRpDate = () => {
  if (localRpProvidedData.value) {
    localRpProvidedData.value = localRpProvidedData.value.filter((val: BasicConfig) => val.id !==
        rpDate.value.id);
  }
  deleteRpDateDialog.value = false;
  rpDate.value = newRpDate();
}

// returns array of field names not including indexed field
const otherFieldNames = (currentIndex:number) => {
  return localRpProvidedData.value
      .filter((data, index) => index != currentIndex)
      .map(data => data.redcap_field_name)
      .concat(props.reservedFieldNames)
}

</script>



<style scoped>

</style>
