<template>
  <Card>
    <template #title>Data Collection Configuration</template>
    <template #content>
      <DataTable
          editMode="row"
          v-model:selection="localCollectionWindowsEditing"
          v-model:editingRows="localCollectionWindowsEditing"
          :value="localCollectionWindows"
          dataKey="id"
  >
    <Column  key="timing_config" header="Timing" headerStyle="width: 3rem">
      <template #body="{ data }">
        <Button icon="pi pi-pencil" class="ml-2"
        @click="showTiming(data)"/>
      </template>
    </Column>
        <Column key="timing.start.label" field="" header="Start" headerStyle="width: 8rem">
          <template #body="{ data }">
            {{ data['timing']['start']['label'] }}
          </template>
        </Column>
        <Column key="timing.end.label" field ="timing.end.label" header="End" headerStyle="width: 8rem">
          <template #body="{ data }">
            {{ data['timing']['end']['label'] }}
          </template>
        </Column>
    <Column  key="label" field="label" header="Form Label" headerStyle="width: 20rem">
      <template #body="{ data, field }">
        <InputText v-model="data[field]" style="width:100%" />
      </template>
    </Column>
        <Column  key="repeat_config" header="Repeating" headerStyle="width: 12rem">
          <template #body="{ data }">
            {{ data['timing']['repeat_interval']['label'] }}&nbsp;
            <Button icon="pi pi-pencil" class="ml-2"
                    @click="showRepeat(data)"/>
          </template>
        </Column>
    <Column key="data" field="data" header="Clinical Data" headerStyle="width: 20rem">
      <template #body="{ data }">
      <Button
          @click="showClinicalData('labs', data)" link>
        Labs&nbsp;<Tag :value="data.data.labs.length"/>

      </Button>
      <Button @click="showClinicalData('vitals', data)" link>
        Vitals&nbsp;<Tag :value="data.data.vitals.length"/>
      </Button>
      <Button @click="showClinicalData('outcomes', data)" link>
        Outcomes&nbsp;<Tag :value="data.data.outcomes.length"/>
      </Button>
      <Button @click="showClinicalData('scores', data)" link>
        Scores&nbsp;<Tag :value="data.data.scores.length"/>
      </Button>
      </template>
    </Column>
        <Column  key="id" field="id" header="Delete" headerStyle="width: 3rem">
          <template #body="{ data, field }">
            <Button icon="pi pi-trash" outlined rounded severity="danger" class="ml-2"
            @click="deleteCw(data[field])"/>
          </template>
        </Column>
  </DataTable>
  <Toolbar class="mb-4">
    <template #end>
      <Button label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="addNew" />
    </template>
  </Toolbar>
    </template>
  </Card>
  <Dialog v-model:visible="showRepeatDialog"
          :modal="true"
          header="Repeating Data Interval">

      <div class="card">

        <div class="flex flex-wrap gap-3">
          <div class="flex align-items-center">
            <label>Collect Data Every </label>
            <div class="flex align-items-center">
              <span class="p-float-label">

            <InputNumber v-model="currentCollectionWindow.timing.repeat_interval.length" id="repeatIntervalLength"
                         inputId="integeronly" :min="1"
                        class="ml-2 mr-1"/>
                    <label for="repeatIntervalLength">Number of</label>
            </span>
              <Dropdown v-model="currentCollectionWindow.timing.repeat_interval.type"
                        :options="INTERVAL_OPTIONS" optionLabel="text"  optionValue="value"
                        placeholder="Interval Periods"
                        class="ml-1 mr-2"/>
              <label> between Start and End Date/Datetimes</label>
            </div>
          </div>
        <div class="flex flex-wrap gap-3">


        </div>
      </div>
      </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancelRepeat"/>
      <Button label="Save" icon="pi pi-check" text @click="saveRepeat" />
    </template>
  </Dialog>
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
  <div>Current: {{ currentCollectionWindow }}</div>
<br>
  <div>Values: {{ localCollectionWindows }}</div>
<br>
  <div>Editing: {{ localCollectionWindowsEditing }}</div>

</template>

<script setup lang="ts">
import {computed, watch, ref, onMounted} from "vue";
import type {PropType} from "vue";
import presets from '../types/CollectionWindowPresets.json';
import type CollectionWindow from "@/types/CollectionWindow";
import ClinicalDataDialog from "./ClinicalDataDialog.vue"
import TimingDialog from "./TimingDialog.vue"
import {INTERVAL_OPTIONS} from "@/types/TimingConfig";
import type {TIMING_TYPE} from "@/types/TimingConfig";

import {INIT_COLLECTION_WINDOW} from "@/types/CollectionWindow";
import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";


const props = defineProps({
  labOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  vitalOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  outcomeOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  scoreOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  clinicalDateOptions: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  rpDates: {
    type: Array as PropType<Array<FieldConfig>>
  },
  collectionWindows: {
    type: Array as PropType<Array<CollectionWindow>>
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
          if (opt.duster_field_name.indexOf('adm') > -1) {
            event.preposition = 'before'
          } else {
            event.preposition = 'after'
          }
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

const saveRepeat = () => {
  if (currentCollectionWindow.value && currentCollectionWindow.value.id) {
    let cw = currentCollectionWindow.value
    if (cw && cw.timing && cw.timing.repeat_interval
        && cw.timing.repeat_interval.length && cw.timing.repeat_interval.type) {
      let type = cw.timing.repeat_interval.type
      let intervalOption =INTERVAL_OPTIONS.filter(option => option.value === type)
      let label = "Every " + cw.timing.repeat_interval.length + " " + intervalOption[0].text
      cw.timing.repeat_interval.label = label
      let editIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindowsEditing.value)
      if (editIndex > -1  && localCollectionWindowsEditing.value && localCollectionWindowsEditing.value[editIndex] &&
          localCollectionWindowsEditing.value[editIndex].timing &&
            localCollectionWindowsEditing.value[editIndex].timing.repeat_interval) {
        localCollectionWindowsEditing.value[editIndex].timing.repeat_interval.label  = label
      }
      let cwIndex = getRowIndex(currentCollectionWindow.value.id, localCollectionWindows.value)
      if (cwIndex > -1 && localCollectionWindows.value && localCollectionWindows.value[editIndex] &&
          localCollectionWindows.value[editIndex].timing &&
          localCollectionWindows.value[editIndex].timing.repeat_interval) {
        localCollectionWindows.value[editIndex].timing.repeat_interval.label  = label
      }
    }
  }
  saveUpdate()
  showRepeatDialog.value = false
}

const cancelRepeat = () => {
  restoreInitialStates()
  showRepeatDialog.value = false
}



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
  if (currentCollectionWindow.value && currentCollectionWindow.value.id) {
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
}*/

const toSnakeCase = (label:string) => {
  return label.replace(/ /g,"_").toLowerCase();
}

</script>

<style scoped>

</style>
