<template>
  <Dialog v-model:visible="visible"
          :modal="true"
          header="Select Clinical Values"
  >
    <!-- add search -->
    <Toolbar>
      <template #start>
          <!-- search input text-->
        <div class="field grid">

        <div class="p-inputgroup flex-1">
            <InputText placeholder="Search Clinical Value"
          v-model="filters['global'].value"

          @update:model-value="expandAll"/>
            <span class="p-inputgroup-addon"><i class="pi pi-search"/></span>
          </div>

          <!-- expand category panels -->
        <div class="flex flex-wrap gap-3 mt-4">
            <label class="flex align-items-center">Display: </label>
            <div class="flex align-items-center"><InputSwitch v-model="expandLabs" />
              <label  class="flex align-items-center"> Labs</label></div>
            <div class="flex align-items-center"><InputSwitch v-model="expandVitals" />
              <label  class="flex align-items-center"> Vitals</label></div>
            <div class="flex align-items-center"><InputSwitch v-model="expandOutcomes" /> Outcomes</div>
            <div class="flex align-items-center"><InputSwitch v-model="expandScores" /> Scores</div>
          </div>

        <!-- select/unselect filters -->

        <div class="flex flex-wrap gap-3 mt-4">
            <label class="flex align-items-center">Show: </label>
            <div v-for="(value, index) in showSelectOptions" :key="index" class="flex align-items-center">
              <RadioButton v-model="selectFilter"
                           name="filterSelected"
                           :inputId="value"
                           :id="value"
                           :value="value"
              />
              <label :for="value" class="flex align-items-center ml-2">{{ value }}</label>
            </div>
          </div>

        </div>
      </template>
      <template #center>
        <div class="card">
          <div class="card-body">
            <div class="flex">
              <div class="card flex flex-wrap justify-content-center gap-3">

              <label>Default Aggregates:</label>

                <div v-for="option in filteredAggregates" :key="option.value" class="flex align-items-center">
                  <Checkbox v-model="aggregateDefaultsLocal"
                            name="defaultAggregate"
                            :id="option.value"
                            :value="option"
                  />
                  <label :for="option.value">{{ option.text }}</label>
                </div>
              </div>
            </div>
            <!-- closest event-->
            <div class="flex">

            <label>Closest To Event:</label>

            <TimingEvent
                :time-type-options="dateOptions"
                event-type="event"
                :event-options="eventOptions"
                :rp-dates="rpDates"
                v-model:timing-object="closestEvent"
              />
              </div>
            <!-- TODO: move this to a TimingEvent component-->
            <!--div-- class="flex flex-wrap gap-3 mt-4">
              <label for="closestEvent" class="flex align-items-center">Closest To Event:</label>
              <div v-for="type in eventTypes" :key="type" class="flex align-items-center">
                <RadioButton v-model="closestEvent.type"
                             :inputId="type"
                             name="eventType"
                             :value="type"
                             :id="type"
                             @change="closestEvent.label = closestEventLabel"
                />
                <label :for="type" class="ml-2">{{ type }}</label>
              </div>
            <div v-if="closestEvent.type=='date'" class="flex align-items-center">
              00:00:00 of
            </div>
            <div class="flex align-items-center"  v-tooltip.bottom="'Must be within the defined data collection window'">
              <Dropdown v-model="closestEventDt"
                        id="closestEvent"
                        :options="eventOptions"
                        optionLabel="label"
                        class="flex align-items-center"
                        @change="closestEvent.label = closestEventLabel"
              />
              <div v-if="closestEvent && closestEvent.duster_field_name" class="flex align-items-center">
                {{ closestEvent.preposition }}&nbsp;
                <Dropdown v-model="closestEvent.rp_date"
                          :options="rpDates"
                          optionLabel="label"
                          optionValue="redcap_field_name"/>
              </div>
            </div>
            </div-->

            <div class="flex mt-3" v-if="hasClosestTime">
              <label class="flex align-items-center">Closest To Time (00:00:00): </label>
              <InputText type="text" v-model="closestTime" class="flex align-items-center"/>
            </div>
          </div>
        </div>
      </template>
    </Toolbar>
    <Panel header="Labs"
           toggleable
           :collapsed="!expandLabs"
    >
      <ClinicalDataOptions
          :options="labOptions"
          :has-aggregates=true
          :has-closest-time="hasClosestTime"
          :search-text="searchText"
          :select-filter="selectFilter"
          v-model:selected-options="clinicalDataLocal.labs"
      />
      <!--- text search works, but haven't added select/unselect filter
      <ClinicalDataOptionsTable
          :options="labOptions"
          :has-aggregates=true
          :has-closest-time="hasClosestTime"
          :search-text="searchText"
          :search-filter="filters"
          :select-filter="selectFilter"
          :columns="2"
          v-model:selected-options="clinicalDataLocal.labs"
      />-->
    </Panel>
    <Panel header="Vitals"
           :collapsed="!expandVitals"
           toggleable>
      <ClinicalDataOptions
          :options="vitalOptions"
          :has-aggregates=true
          :has-closest-time="hasClosestTime"
          :search-text="searchText"
          :select-filter="selectFilter"
          v-model:selected-options="clinicalDataLocal.vitals"
      />
    </Panel>
    <Panel header="Outcomes"
           :collapsed="!expandOutcomes"
           toggleable>
      <ClinicalDataOptions
          :options="outcomeOptions"
          :has-aggregates=false
          :search-text="searchText"
          :select-filter="selectFilter"
          v-model:selected-options="clinicalDataLocal.outcomes"
      />
    </Panel>
    <Panel header="Scores"
           :collapsed="!expandScores"
           toggleable>
      <ClinicalDataOptions
          :options="scoreOptions"
          :has-aggregates=false
          :search-text="searchText"
          :select-filter="selectFilter"
          v-model:selected-options="clinicalDataLocal.scores"
      />
    </Panel>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancelClinicalData"/>
      <Button label="Save" icon="pi pi-check" text @click="saveClinicalData"/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, watch, ref} from "vue";
import type {PropType} from "vue";
import type FieldMetadata from "@/types/FieldMetadata";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import type FieldConfig from "@/types/FieldConfig";
import ClinicalDataOptions from "./ClinicalDataOptions.vue";
import ClinicalDataOptionsTable from "./ClinicalDataOptionsTable.vue";
import type TimingConfig from "@/types/TimingConfig";
import type {TIMING_TYPE} from "@/types/TimingConfig";
import {FilterMatchMode} from "primevue/api";
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import type TextValuePair from "@/types/TextValuePair";
import TimingEvent from "./TimingEvent.vue";

const props = defineProps({
  showClinicalDataDialog: Boolean,
  showLabs: Boolean,
  showVitals: Boolean,
  showOutcomes: Boolean,
  showScores: Boolean,
  timing: {
    type: Object
  },
  clinicalData: {
    type: Object
  },
  aggregateDefaults: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  closestToEvent : {
    type: Object as PropType<TimingConfig>
  },
  closestToTime : {
    type: String
  },
  eventOptions: {
    type: Array as PropType<Array<TimingConfig>>,
    required: true
  },
  rpDates: {
    type: Array as PropType<Array<FieldConfig>>,
    required: true
  },
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
  }
})

const emit = defineEmits(
    ['saveClinicalDataUpdate', 'cancelClinicalDataUpdate',
      'update:clinicalData', 'update:aggregateDefaults','update:showClinicalDataDialog',
      'update:showLabs','update:showVitals',
      'update:showOutcomes','update:showScores',
      'update:closestToEvent', 'update:closestToTime']
)

const filters = ref<any>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const searchText = computed(
  () => {
    return filters.value.global.value
  }
)

const visible = computed({
  get() {
    return props.showClinicalDataDialog;
  },
  set(value) {
    emit('update:showClinicalDataDialog', value)
  }
});

const closestEvent = computed({
  get() {
    return props.closestToEvent;
  },
  set(value) {
    emit('update:closestToEvent', value)
  }
})

const closestTime = computed({
  get() {
    return props.closestToTime;
  },
  set(value) {
    emit('update:closestToTime', value)
  }
})

const dateOptions = ref<TextValuePair[]>([
    {text:'Date', value:'date'},
    {text:'Datetime',value:'datetime'}])

/*refactored into TimingEvent component
const closestEventDt = computed<TimingConfig>({
  get() {
    if (closestEvent.value) {
      if (closestEvent.value.duster_field_name) {

        let dusterFieldName = closestEvent.value.duster_field_name
        let index = props.eventOptions.findIndex((dttm) => dttm.duster_field_name ==
            dusterFieldName)
        return props.eventOptions[index]
      } else if (closestEvent.value.redcap_field_name) {
        let redcapFieldName = closestEvent.value.redcap_field_name

        let index = props.eventOptions.findIndex((dttm) => dttm.redcap_field_name ==
            redcapFieldName)
        return props.eventOptions[index]
      }
    }
    return INIT_TIMING_CONFIG
  },
  set(value) {
    if (closestEvent.value) {
      closestEvent.value.preposition = value.preposition
      closestEvent.value.value_type = value.value_type
      closestEvent.value.redcap_field_type = value.redcap_field_type
      if (value.duster_field_name) {
        closestEvent.value.duster_field_name = value.duster_field_name
      } else if (value.redcap_field_name) {
        closestEvent.value.redcap_field_name = value.redcap_field_name
      }
    }
  }
  }
)

const getDateText = (options:TimingConfig[], dusterFieldName?:string|null, redcapFieldName?:string|null) => {
  if (dusterFieldName) {
    let option = options.find(opt => opt.duster_field_name === dusterFieldName)
    if (option) return option.label
  } else if (redcapFieldName) {
    let option = options.find(opt => opt.redcap_field_name === redcapFieldName)
    if (option) return option.label
  }
  return ""
}

const closestEventLabel = computed(() => {
  if (closestEvent.value) {
    let label = getDateText(props.eventOptions, closestEvent.value.duster_field_name,
        closestEvent.value.redcap_field_name)

    if (closestEvent.value.type == 'date') {
      return "00:00:00 of " + label
    }
    return label
  }
  return "Unknown Event"
})*/

const expandLabs = computed({
  get() {
    return props.showLabs
  },
  set(value) {
    emit('update:showLabs', value)
  }
  })
const expandVitals = computed({
  get() {
    return props.showVitals
  },
  set(value) {
    emit('update:showVitals', value)
  }
})
const expandOutcomes = computed({
  get() {
    return props.showOutcomes
  },
  set(value) {
    emit('update:showOutcomes', value)
  }
})
const expandScores = computed({
  get() {
    return props.showScores
  },
  set(value) {
    emit('update:showScores', value)
  }
})

const showSelectOptions = ref<string[]>(['Selected','Unselected','All'])
const selectFilter = ref<string>("All")

const expandAll = () => {
  expandLabs.value = true
  expandVitals.value = true
  expandOutcomes.value = true
  expandScores.value = true

}

const filteredAggregates = computed(() => {
  if (!hasClosestTime.value) {
    return AGGREGATE_OPTIONS.filter(option => option.value !== 'closest_time');
  }
  return AGGREGATE_OPTIONS
})

const clinicalDataLocal = computed({
  get() {
    return props.clinicalData;
  },
  set(value) {
    emit('update:clinicalData', value)
  }
});

const aggregateDefaultsLocal = computed({
  get() {
    return props.aggregateDefaults;
  },
  set(value) {
    emit('update:aggregateDefaults', value)
  }
});

const hasClosestTime = computed(() => {
  if (props.timing) {
    if (props.timing.start.interval.type == "day" && props.timing.start.interval.length == 1) {
      return true
    }
    if (props.timing.end.interval.type == "day" && props.timing.end.interval.length == 1) {
      return true
    }
    if (props.timing.repeat_interval.type == "day" && props.timing.repeat_interval.length == 1) {
      return true
    }
    /*if (props.timing.start.interval.type=="hour" && props.timing.start.interval.length == 24) {
      return true
    }
    if (props.timing.end.interval.type=="hour" && props.timing.end.interval.length == 24) {
      return true
    }
    if (props.timing.repeat_interval.type=="hour" && props.timing.repeat_interval.length == 24) {
      return true
    }*/
    return false
  }
  return false
})

const saveClinicalData = () => {
  visible.value = false
  emit('saveClinicalDataUpdate')
}

const cancelClinicalData = () => {
  visible.value = false
  emit('cancelClinicalDataUpdate')
}


</script>

<style scoped>

</style>
