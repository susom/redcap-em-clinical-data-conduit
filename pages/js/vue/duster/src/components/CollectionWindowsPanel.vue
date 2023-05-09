<template>
  <Panel header="Data Collection Configuration">
      <DataTable
          editMode="row"
          class="p-datatable-sm"
          v-model:selection="localCollectionWindowsEditing"
          v-model:editingRows="localCollectionWindowsEditing"
          :value="localCollectionWindows"
          dataKey="id"
  >
    <Column  key="timing_config" header="Timing" style="width: 3rem">
      <template #body="{ data }">
        <Button icon="pi pi-pencil" class="ml-2"
        @click="showTiming(data)"/>
      </template>
    </Column>
        <Column key="timing.start.label" field="" header="Start" style="width: 8rem">
          <template #body="{ data }" >
            <span v-if="data['timing']['start']['label']">
            {{ data['timing']['start']['label'] }}
              </span>
            <span v-else style="color:red">
            Undefined
          </span>
          </template>
        </Column>
        <Column key="timing.end.label" field ="timing.end.label" header="End" style="width: 8rem">
          <template #body="{ data }">
             <span v-if="data['timing']['start']['label']">
            {{ data['timing']['end']['label'] }}
              </span>
            <span v-else style="color:red">
            Undefined
          </span>
          </template>
        </Column>
        <Column  key="repeat_config" header="Repeat Interval" style="width: 8rem">
          <template #body="{ data }">
            {{ data['timing']['repeat_interval']['label'] }}&nbsp;
            <!--Button icon="pi pi-pencil" class="ml-2"
                    @click="showRepeat(data)"/-->
          </template>
        </Column>
    <Column  key="label" field="label" header="Label" style="width: 20rem">
      <template #body="slotProps">
        <div class="field">
        <InputTextRequired
            :name="`localCollectionWindows[${slotProps.index}].label`"
            v-model="slotProps.data[slotProps.field]"
            classDef="w-full md:w-8rem"
            :rules="{required: true, not_one_of:otherFormLabels(slotProps.index)}"
        />
        </div>
      </template>
    </Column>

    <Column key="data" field="data" header="Clinical Data" style="width: 30rem">
      <template #body="{ data }">
        <Button @click="showClinicalData('labs', data)" size="small" class=" p-1" rounded>
            Labs<span class="p-badge p-component p-badge-no-gutter">{{ data.data.labs.length }}</span>
        </Button>
        <Button @click="showClinicalData('vitals', data)" size="small" class="ml-1 p-1" rounded>
            Vitals<span class="p-badge p-component p-badge-no-gutter">{{ data.data.vitals.length }}</span>
        </Button>
        <Button @click="showClinicalData('outcomes', data)" size="small" class="ml-1 p-1" rounded>
            Outcomes<span class="p-badge p-component p-badge-no-gutter">{{ data.data.outcomes.length }}</span>
        </Button>
        <Button @click="showClinicalData('scores', data)" size="small" class="ml-1 p-1" rounded>
            Scores<span class="p-badge p-component p-badge-no-gutter">{{ data.data.scores.length }}</span>
        </Button>
        <!--
      <Button
          @click="showClinicalData('labs', data)" link size="small">
        Labs&nbsp;<Tag :value="data.data.labs.length"/>

      </Button>
      <Button @click="showClinicalData('vitals', data)" link size="small">
        Vitals&nbsp;<Tag :value="data.data.vitals.length"/>
      </Button>
      <Button @click="showClinicalData('outcomes', data)" link size="small">
        Outcomes&nbsp;<Tag :value="data.data.outcomes.length"/>
      </Button>
      <Button @click="showClinicalData('scores', data)" link size="small">
        Scores&nbsp;<Tag :value="data.data.scores.length"/>
      </Button>
      -->
      </template>
    </Column>
        <Column  key="id" field="id" header="Delete" style="width: 8rem">
          <template #body="{ data, field }">
            <Button icon="pi pi-trash" outlined rounded severity="danger" class="ml-2"
            @click="deleteCw(data[field])"/>
          </template>
        </Column>
        <template #footer>
          <div class="text-right">
            <Button label="Add Data Collection"
                    icon="pi pi-plus"
                    severity="success"
                    class="mr-2"
                    @click="addNew" />
          </div>
        </template>
  </DataTable>

  </Panel>

  <TimingDialog
      v-model:show-timing-dialog = "showTimingDialog"
      v-model:collection-window = "currentCollectionWindow"
      :event-options="eventDts"
      :rp-dates="rpDates"
      :presets="presets.cw_presets"
      @save-timing-update="saveUpdate"
      @cancel-timing-update="restoreInitialStates"
  />

  <ClinicalDataDialog
      v-model:show-clinical-data-dialog = "showClinicalDataDialog"
      v-model:clinical-data= "currentCollectionWindow.data"
      v-model:aggregate-defaults= "currentCollectionWindow.aggregate_defaults"
      :clinical-data-category = "clinicalDataCategory"
      :timing = "currentCollectionWindow.timing"
      :lab-options="labOptions"
      :vital-options="vitalOptions"
      :score-options="scoreOptions"
      :outcome-options="outcomeOptions"
      v-model:show-labs="showLabs"
      v-model:show-vitals="showVitals"
      v-model:show-scores="showScores"
      v-model:show-outcomes="showOutcomes"
      v-model:closest-to-event = "currentCollectionWindow.event"
      v-model:closest-to-time = "currentCollectionWindow.closest_time"

      :event-options="eventDts"
      :rp-dates="rpDates"
      @save-clinical-data-update="saveUpdate"
      @cancel-clinical-data-update="restoreInitialStates"
  />
  <!--div>Current: {{ currentCollectionWindow }}</div>
<br>
  <div>Values: {{ localCollectionWindows }}</div>
<br>
  <div>Editing: {{ localCollectionWindowsEditing }}</div-->
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import type {PropType} from "vue";
import presets from '../types/CollectionWindowPresets.json';
import type CollectionWindow from "@/types/CollectionWindow";
import ClinicalDataDialog from "./ClinicalDataDialog.vue"
import TimingDialog from "./TimingDialog.vue"
import InputTextRequired from "./InputTextWithValidation.vue"
import {INTERVAL_OPTIONS} from "@/types/TimingConfig";
import type {TIMING_TYPE} from "@/types/TimingConfig";

import {INIT_COLLECTION_WINDOW} from "@/types/CollectionWindow";
import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";
import { required } from '@vee-validate/rules';


const props = defineProps({
  labOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  vitalOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  outcomeOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  scoreOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  clinicalDateOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  rpDates: {
    type: Array as PropType<Array<FieldConfig>>,
    required: true
  },
  collectionWindows: {
    type: Array as PropType<Array<CollectionWindow>>,
    required: true
  }
})

const emit = defineEmits(['update:collectionWindows'])

const currentCollectionWindow = ref<CollectionWindow>(INIT_COLLECTION_WINDOW);
const savedCollectionWindow = ref<CollectionWindow>()
//const localCollectionWindows = ref<CollectionWindow[]>([currentCollectionWindow.value])
const localCollectionWindowsEditing = ref<CollectionWindow[]>([])
const showTimingDialog = ref(false)
const showRepeatDialog = ref(false)
const showClinicalDataDialog = ref(false)

const localCollectionWindows = computed({
get() {
  return props.collectionWindows;
},
set(value) {
  emit('update:collectionWindows', value)
}
});

/*assume we are starting with no collection windows defined*/
onMounted(()=> {
  // delete the inital cw used to initialize the table
  if (localCollectionWindows.value) {
    let index = getRowIndex("Undefined", localCollectionWindows.value)
    localCollectionWindows.value.splice(index, 1)
    if (localCollectionWindows.value.length == 0) {
      addNew()
    }
  }
})

const addNew = () => {
  const newCw = JSON.parse(JSON.stringify(INIT_COLLECTION_WINDOW))
  newCw.id = "cw" + new Date().getTime()
  currentCollectionWindow.value = newCw
  if (localCollectionWindows.value) {
    localCollectionWindows.value.push(newCw)
  }
  /*if (localCollectionWindowsEditing.value) {
    localCollectionWindowsEditing.value.push(newCw)
  }*/
}


// to restore after cancel
const saveInitialState = (cw: CollectionWindow) => {
  currentCollectionWindow.value = cw
  savedCollectionWindow.value = JSON.parse(JSON.stringify(cw))
  // add to editing
  localCollectionWindowsEditing.value.push(currentCollectionWindow.value)
}

const showTiming = (cw:CollectionWindow) => {
  saveInitialState(cw)
  showTimingDialog.value = true
}

const showLabs = ref<boolean>(false)
const showVitals = ref<boolean>(false)
const showScores = ref<boolean>(false)
const showOutcomes = ref<boolean>(false)

const showClinicalData = (category:string, cw: CollectionWindow) => {
  saveInitialState(cw)
  clinicalDataCategory.value = category
  showClinicalDataDialog.value = true
  showLabs.value = (category == 'labs')
  showVitals.value = (category == 'vitals')
  showScores.value = (category == 'scores')
  showOutcomes.value = (category == 'outcomes')
}

const showRepeat = (cw:CollectionWindow) => {
  saveInitialState(cw)
  showRepeatDialog.value = true
}

const eventDts = computed<TimingConfig[]>(
    () => {
      let events: TimingConfig[] = []
      if (props.clinicalDateOptions) {
        props.clinicalDateOptions.forEach(opt => {
          let event:TimingConfig = {
            type: "datetime",
            label: opt.label,
            redcap_field_name: undefined,
            redcap_field_type: opt.redcap_field_type,
            duster_field_name: opt.duster_field_name,
            value_type: opt.value_type,
            preposition: "",
            phi: "t"
          }
          /*if (opt.duster_field_name.indexOf('adm') > -1) {
            event.preposition = 'before'
          } else {
            event.preposition = 'after'
          }*/
          events.push(event)
        })
      }
      if (props.rpDates) {
        props.rpDates.forEach(opt => {
          let rpdateType: TIMING_TYPE = (opt.value_type == 'date') ? 'date' : 'datetime'
          events.push({
            type: rpdateType,
            label: opt.label,
            redcap_field_name: opt.redcap_field_name,
            redcap_field_type: opt.redcap_field_type,
            duster_field_name: undefined,
            value_type: opt.value_type,
            phi: "t"
          })
        })
      }
      return events;
    });

/*const saveRepeat = () => {
  if (currentCollectionWindow.value && currentCollectionWindow.value.id) {
    let cw = currentCollectionWindow.value
    if (cw && cw.timing && cw.timing.repeat_interval) {
      let type = cw.timing.repeat_interval?.type
      let intervalOption = INTERVAL_OPTIONS.filter(option => option.value === type)
      let label = "Every " + cw.timing.repeat_interval.length + " " + intervalOption[0].text
      cw.timing.repeat_interval.label = label
      if (localCollectionWindows.value && localCollectionWindowsEditing.value) {
        let editIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindowsEditing.value)
        if (editIndex > -1 && localCollectionWindowsEditing.value
            && localCollectionWindowsEditing.value[editIndex]
            && localCollectionWindowsEditing.value[editIndex].timing
            // @ts-ignore
            && localCollectionWindowsEditing.value[editIndex].timing.repeat_interval) {
          // @ts-ignore
          localCollectionWindowsEditing.value[editIndex].timing.repeat_interval['label'] = label
      }
      let cwIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindows.value)
      if (cwIndex > -1 && localCollectionWindows.value && localCollectionWindows.value[editIndex] &&
          localCollectionWindows.value[editIndex].timing &&
          // @ts-ignore
          localCollectionWindows.value[editIndex].timing.repeat_interval) {
        // @ts-ignore
        localCollectionWindows.value[editIndex].timing.repeat_interval.label = label
      }
    }
    }
  }
  saveUpdate()
  showRepeatDialog.value = false
}

const cancelRepeat = () => {
  restoreInitialStates()
  showRepeatDialog.value = false
}*/

const clinicalDataCategory = ref<string>()

const saveUpdate = () => {
  // remove from editing?
  if (currentCollectionWindow.value && currentCollectionWindow.value.id) {
    let editIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindowsEditing.value)
    if (localCollectionWindowsEditing.value && editIndex > -1) {
      localCollectionWindowsEditing.value.splice(editIndex, 1)
    }
  }
}

const restoreInitialStates = () => {
  if (localCollectionWindows.value && currentCollectionWindow.value && currentCollectionWindow.value.id) {
    let editIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindowsEditing.value)
    if (savedCollectionWindow.value && editIndex > -1) {
      localCollectionWindowsEditing.value[editIndex] = savedCollectionWindow.value
    }
    let cwIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindows.value)
    if (savedCollectionWindow.value && cwIndex > -1) {
      localCollectionWindows.value[cwIndex] = savedCollectionWindow.value
    }
  }
  saveUpdate()
}

const deleteCw = (id:string) => {
  if (localCollectionWindows.value) {
    let index = getRowIndex(id, localCollectionWindows.value)
    localCollectionWindows.value.splice(index, 1)
  }
  /*if (localCollectionWindowsEditing.value) {
    let index = getRowIndex(id, localCollectionWindowsEditing.value)
    localCollectionWindowsEditing.value.splice(index, 1)
  }*/

}

const getRowIndex = (id:string, haystack:any[]) => {
  console.log(id)
  return haystack.findIndex(
      (cw) => cw.id === id)
}

// return array of other formNames
const otherFormLabels = (formIndex: number) => {
  return localCollectionWindows.value
      .filter((cw, index) => index != formIndex)
      .map(cw => cw.label)
}

/*const saveClinicalData = (clinicalData:any, aggregateDefaults:any[]) => {
  showClinicalDataDialog.value = false
  if (currentCollectionWindow.value && currentCollectionWindow.value.id) {
    let index = getRowIndex(currentCollectionWindow.value.id, localCollectionWindows.value)
    localCollectionWindows.value[index].data = JSON.parse(JSON.stringify(clinicalData))
    localCollectionWindows.value[index]['aggregate_defaults'] = JSON.parse(JSON.stringify(aggregateDefaults))
    localCollectionWindowsEditing.value = JSON.parse(JSON.stringify(localCollectionWindows.value))
  }
}

const updateCwTiming = (event:any, data:any) => {
  console.log(event.value)
  const eventValue = event.value
  if (eventValue == "custom") {
    data.timing = undefined
  } else {
    presets.cw_presets.forEach((preset, index) => {
      if (data.timing_preset == preset.timing_preset) {
        data.label = preset.label
        data.form_name = toSnakeCase(preset.timing_preset)
        data.timing = preset.timing
      }
    });
  }
}

const toSnakeCase = (label:string) => {
  return label.replace(/ /g,"_").toLowerCase();
}*/

</script>


<style scoped>
:deep(.p-datatable-header) {
  background: blue
}

</style>
