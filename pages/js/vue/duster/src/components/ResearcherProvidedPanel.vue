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
              <!--DropdownWithValidation
                  v-if="localRpProvidedData[slotProps.index].value_type != 'Identifier'"
                  v-model="localRpProvidedData[slotProps.index].value_type"
                  :name="`localRpProvidedData[${slotProps.index}].value_type`"
                  :options="dateTypes"
                  option-label="text"
                  option-value="dtValue"
                  class-def="w-full"
                  placeholder="Select a type"
                  rules="required"
              /-->
              <div class="field"
                   v-if="localRpProvidedData[slotProps.index].value_type != 'Identifier'">
              <Dropdown
                  v-model="slotProps.data[slotProps.field]"
                    :options="dateTypes"
                    :class="['w-full md:w-6rem',{'p-invalid':v$.rpData.$each.$response.$errors[slotProps.index].value_type.length}]"
                    optionLabel="text"
                    optionValue="dtValue"
                    placeholder="Select a type">
                </Dropdown>
                <small v-if="v$.rpData.$each.$response.$errors[slotProps.index].value_type.length"
                       class="flex p-error mb-3">
                  {{ v$.rpData.$each.$response.$errors[slotProps.index].value_type[0].$message }}
                </small>
              </div>
              <span v-else>{{slotProps.data.value_type}}</span>
            </template>
          </Column>
          <Column
              key="label"
              field="label"
              header="Label">
            <template
                #body="slotProps">
              <div class="field">
              <InputText
                  v-model="slotProps.data[slotProps.field]"
                  :class="['w-full', {'p-invalid': v$.rpData.$each.$response.$errors[slotProps.index].label.length}]">
              </InputText>
              <small v-if="v$.rpData.$each.$response.$errors[slotProps.index].label.length"
                     class="flex p-error mb-3">
                {{ v$.rpData.$each.$response.$errors[slotProps.index].label[0].$message }}
              </small>
              </div>
              <!--InputTextRequired
                  :name="`localRpProvidedData[${slotProps.index}].label`"
                  v-model="slotProps.data[slotProps.field]"
                  classDef="w-full"
                  rules="required"
              /-->
            </template>
          </Column>
          <Column
              key="redcap_field_name"
              field="redcap_field_name"
              header="Field Name"
              >
            <template
                #body="slotProps">
              <div class="field">
                <InputText
                    v-model="slotProps.data[slotProps.field]"
                    :class="['w-full', {'p-invalid': v$.rpData.$each.$response.$errors[slotProps.index].redcap_field_name.length}]">
                </InputText>
                <small v-if="v$.rpData.$each.$response.$errors[slotProps.index].redcap_field_name.length"
                       class="flex p-error mb-3">
                  {{ v$.rpData.$each.$response.$errors[slotProps.index].redcap_field_name[0].$message }}
                </small>
              </div>
              <!--InputTextRequired
                  :name="`localRpProvidedData[${slotProps.index}].redcap_field_name`"
                   v-model="localRpProvidedData[slotProps.index].redcap_field_name"
                  classDef="w-full"
                  :rules="{required: true,
                  redcap_field_name:true,
                  not_one_of:otherFieldNames(slotProps.index)}"
              /-->
            </template>
          </Column>
          <Column
              :exportable="false"
              header="Actions">
            <template
                #body="slotProps">
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
                  :class="((slotProps.index == (localRpProvidedData.length -1)) && slotProps.index < 5  )? '': 'hidden'"
                  @click="addRpDate" >
              </Button>

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
import InputTextRequired from "./InputTextWithValidation.vue";
import DropdownWithValidation from "./DropdownWithValidation.vue";
import {INIT_BASIC_CONFIG} from "@/types/FieldConfig";
import {helpers, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";


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

// returns array of field names not including current field
// includes reserved redcap_field_names of demographics
const otherFieldNames = (id:string) => {
  return localRpProvidedData.value
      .filter((data) => data.id != id)
      .map(data => data.redcap_field_name)
      .concat(props.reservedFieldNames)
}

const uniqueLabel = (value:string, siblings:any, vm: any) => {
  return (localRpProvidedData.value.findIndex(rp => rp.id != siblings.id && rp.label == value) == -1)
}

const uniqueRedcapFieldName = (value:string, siblings:any, vm: any) => {
  return (otherFieldNames(siblings.id ?? "").indexOf(value) == -1)
}

const isRedcapFieldName = helpers.regex(/^[a-z][a-z0-9_]*$/)

const state = computed(() => {
  return {
    rpData: localRpProvidedData.value
  }
})
const rules = {
  rpData: {
    $each: helpers.forEach({
          value_type: {
            required: helpers.withMessage('Date types are required', required)
          },
          label: {
            required: helpers.withMessage('Labels are required', required),
            uniqueLabel: helpers.withMessage('Labels must be unique', uniqueLabel)
          },
      redcap_field_name: {
            required: helpers.withMessage('Redcap field names are required', required),
            isRedcapFieldName: helpers.withMessage('Only lowercase letters, numbers and underscores allowed',
                isRedcapFieldName),
            uniqueRedcapFieldName: helpers.withMessage('Must be unique',
                uniqueRedcapFieldName)
      }
        }
    )
  }
}

const v$ = useVuelidate(rules, state)

</script>



<style scoped>

</style>
