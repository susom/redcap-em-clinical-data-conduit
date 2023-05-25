<template>
      <Dialog v-model:visible="visible"
              :modal="true"
              :style="{ width: '75vw' }"
              header="Select Clinical Values"
      >

        <!-- add search -->
        <div class="grid">
          <div class="col-6 mt-2">
            <div class="p-inputgroup flex">
              <InputText
                  placeholder="Search Clinical Value"
                  v-model="filters['global'].value"
                  @update:model-value="expandAll"/>
              <span class="p-inputgroup-addon"><i class="pi pi-search"/></span>
            </div>
          </div>

          <div class="col-6 mt-2">
            <!-- expand category panels -->
            <!--div class="form grid">
              <div class="col-fixed"><label class="flex align-items-center">Display: </label>
              </div>
              <div class="col">
                <div class="flex flex-wrap gap-3">
                  <div class="flex align-items-center">
                    <InputSwitch v-model="expandLabs"/>
                    <label class="flex align-items-center"> Labs</label></div>
                  <div class="flex align-items-center">
                    <InputSwitch v-model="expandVitals"/>
                    <label class="flex align-items-center"> Vitals</label></div>
                  <div class="flex align-items-center">
                    <InputSwitch v-model="expandOutcomes"/>
                    Outcomes
                  </div>
                  <div class="flex align-items-center">
                    <InputSwitch v-model="expandScores"/>
                    Scores
                  </div>
                </div>
              </div>
            </div-->
            <!-- select/unselect filters -->
            <div class="flex flex-wrap gap-3">
              <label class="flex align-items-center">Show: </label>
              <div v-for="(value, index) in selectOptions" :key="index" class="flex align-items-center">
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
        </div>
        <hr/>
        <!-- default aggregates-->
        <div class="field grid mt-2">
          <label class="col-2">Default Aggregates:</label>

          <div class="col">
            <div class="formgroup-inline">
              <div v-for="(option) in filteredAggregates" :key="option.value" class="field-checkbox">
                <Checkbox
                    name="defaultAggregate"
                    v-model="localAggregateDefaults"
                    :value="option"
                    :input-id="option.value"
                    :id="option.value"
                    :class="{ 'p-invalid': v$.aggregateDefaults.$error }"
                />
                <label :for="option.value">{{ option.text }}</label>
              </div>
              <!-- closest time-->
              <div v-if="hasClosestTime" class="formgroup-inline">
                <div class="field-checkbox">
                  <Checkbox v-model="localAggregateDefaults"
                            name="defaultAggregate"
                            :id="closestTimeOption.value"
                            :value="closestTimeOption"
                            :class="{ 'p-invalid': v$.aggregateDefaults.$error }"
                  />
                  <label :for="closestTimeOption.value">{{ closestTimeOption.text }}</label>
                </div>
                <div class="field" v-if="showClosestTime">
                  <Calendar id="calendar-timeonly" v-model="closestCalendarTime" timeOnly />

                  <!--InputText v-model="closestTime"
                           style="width:10rem"
                           placeholder="00:00:00"
                           :class="['w-full md:w-10rem',{'p-invalid': v$.closestTime.$error}]"
                /-->
                <small v-if="v$.closestTime.$error"
                       class="flex p-error mb-3">
                  {{ v$.closestTime.$errors[0].$message }}
                </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- closest event-->
        <div v-if="hasClosestEvent" class="field grid">
            <div class="formgroup-inline col">
              <div class="col-offset-2 col-12">
              <div class="field-checkbox">
                <Checkbox v-model="localAggregateDefaults"
                          name="defaultAggregate"
                          :id="closestEventOption.value"
                          :value="closestEventOption"
                          :class="{ 'p-invalid': v$.aggregateDefaults.$error }"
                />
                <label :for="closestEventOption.value">{{ closestEventOption.text }}</label>
              </div>
              <div v-if="showClosestEvent" class="formgroup-inline">
                <div class="field">
                  <Dropdown v-model="localClosestEvent"
                    :options="datetimeEventOptions"
                    optionLabel="label"
                    :class="{ 'p-invalid': v$.closestEventValue.$error }"
              style="width:10rem"/>
    <small v-if="v$.closestEventValue.$error"
           class="flex p-error mb-3">
      {{ v$.closestEventValue.$errors[0].$message }}
    </small>
  </div>
                <!--This is to set the rp_date -- will default to start of collection window instead
                of user configuration
                div v-if="localClosestEvent.duster_field_name" class="field">
                  <label> based on </label>
                  <span>
                  <Dropdown v-model="localClosestEvent.rp_date"
                        :options="rpDates"
                        optionLabel="label"
                        optionValue="redcap_field_name"
                        :class="{ 'p-invalid': closestEventRpDateError }"
                        placeholder="Select an event"
                        style="width:10rem"/>
                    <small v-if="closestEventRpDateError"
                      class="flex p-error mb-3">
                      {{ closestEventRpDateError }}
                    </small>
                  </span>
                </div-->
              </div>
            </div>
            <small
                v-if="v$.aggregateDefaults.$error"
                id="aggOption-help"
                class="flex p-error mb-3">
              {{ v$.aggregateDefaults.$errors[0].$message }}
            </small>
          </div>
        </div>
        <Accordion :multiple="true" :activeIndex="activeClinicalOptions">
        <AccordionTab header="Labs">
          <ClinicalDataOptions
              category="labs"
              :options="labOptions"
              :has-aggregates=true
              :has-closest-time="hasClosestTime"
              :search-text="searchText"
              :select-filter="selectFilter"
              v-model:selected-options="localClinicalData.labs"
          />
        </AccordionTab>
        <AccordionTab header="Vitals">
          <ClinicalDataOptions
              category="vitals"
              :options="vitalOptions"
              :has-aggregates=true
              :has-closest-time="hasClosestTime"
              :search-text="searchText"
              :select-filter="selectFilter"
              v-model:selected-options="localClinicalData.vitals"
          />
        </AccordionTab>
        <AccordionTab header="Outcomes">
          <ClinicalDataOptions
              category="outcomes"
              :options="outcomeOptions"
              :has-aggregates=false
              :has-closest-time=false
              :search-text="searchText"
              :select-filter="selectFilter"
              v-model:selected-options="localClinicalData.outcomes"
          />
        </AccordionTab>
        <AccordionTab header="Scores">
          <ClinicalDataOptions
              category="scores"
              :options="scoreOptions"
              :has-aggregates=false
              :has-closest-time=false
              :search-text="searchText"
              :select-filter="selectFilter"
              v-model:selected-options="localClinicalData.scores"
          />
        </AccordionTab>
</Accordion>
        <Toast />
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="cancelClinicalData"/>
          <Button label="Save" icon="pi pi-check" text @click="saveClinicalData"/>
        </template>
      </Dialog>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import type {PropType} from "vue";
import {FilterMatchMode} from "primevue/api";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";
import type TextValuePair from "@/types/TextValuePair";
import ClinicalDataOptions from "./ClinicalDataOptions.vue";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast'
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import {helpers, requiredIf, minLength} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const props = defineProps({
  showClinicalDataDialog: Boolean,
  activeOptions: Array as PropType<Array<number>>,
  timing: {
    type: Object,
    required: true
  },
  clinicalData: {
    type: Object,
    required: true
  },
  aggregateDefaults: {
    type: Array as PropType<Array<TextValuePair>>
  },
  closestToEvent: {
    type: Array as PropType<Array<TimingConfig>>
  },
  closestToTime: {
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
      'update:clinicalData', 'update:aggregateDefaults', 'update:showClinicalDataDialog',
      'update:activeOptions',
      'update:closestToEvent', 'update:closestToTime']
)

const filters = ref<any>({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS}
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

const localClinicalData = computed({
  get() {
    return props.clinicalData;
  },
  set(value) {
    emit('update:clinicalData', value)
  }
});

const localAggregateDefaults = computed({
  get() {
    return props.aggregateDefaults;
  },
  set(value) {
    emit('update:aggregateDefaults', value)
  }
});

// remove the "closest to" options to display them on a separate line
const filteredAggregates = computed(() => {
  return AGGREGATE_OPTIONS.filter(option => option.value.indexOf('closest') === -1);
})

/*** closest event ***/

const closestEvent = computed({
  get() {
    return props.closestToEvent;
  },
  set(value) {
    emit('update:closestToEvent', value)
  }
})

/* closestEvent is an array with only one element
so this makes accessing it more convenient*/
const localClosestEvent = ref<TimingConfig>(JSON.parse(JSON.stringify(INIT_TIMING_CONFIG)))
watchEffect(() => {
  if (!closestEvent.value) {
    closestEvent.value = []
  }
  closestEvent.value[0] = localClosestEvent.value ?? JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
})

/** separate out closest event checkbox option to be displayed separately **/
const closestEventOption = computed(() => {
  return (AGGREGATE_OPTIONS.find(option => option.value === 'closest_event')
      ?? {text:"Closest Event", value:"closest_event"})
})

const showClosestEvent = computed(() => {
  // show closest event if it's selected as a default
  let show = false
  if (localAggregateDefaults.value) {
    show = (localAggregateDefaults.value.findIndex(agg => agg.value === 'closest_event') > -1)
  }
  if (!show) {
      // show closest event if it's selected as a custom aggregate
      show = localClinicalData.value.labs.findIndex((cd: any) =>
          (cd.selected && cd.aggregate_type === 'custom' &&
              (JSON.stringify(cd.aggregates).indexOf("closest_event") > -1))) > -1
  }
  return show
})

/** closest event selector should only show datetime options **/
const datetimeEventOptions = computed(() => {
  return props.eventOptions.filter(option => option.value_type === 'datetime')
})


/*** closest time ***/
const closestTime = computed({
  get() {
    return props.closestToTime;
  },
  set(value) {
    emit('update:closestToTime', value)
  }
})

const calDate = new Date()
const closestCalendarTime = ref(Date())

/*const closestCalendarTime = computed({
  get() {
    if (props.closestToTime) {
      calDate.setHours(parseInt(props.closestToTime.slice(0, 2)))
      calDate.setMinutes(parseInt(props.closestToTime.slice(4, 6)))
    } else {
      calDate.setHours(0)
      calDate.setMinutes(0)
    }
      calDate.setSeconds(0)
    return calDate;
  },
  set(value: Date) {
    emit('update:closestToTime', value.getHours() + ":" + value.getMinutes() + ":00")
  }
})*/


/** closest time checkbox option **/
const closestTimeOption = computed(() => {
  return (AGGREGATE_OPTIONS.find(option => option.value === 'closest_time')
      ?? {text:"Closest Time", value:"closest_time"})
})

/* whether to show closest event as default aggregate*/
const hasClosestEvent = computed(() => {
  if (props.timing) {
    if (props.timing.repeat_interval
        && props.timing.repeat_interval.length > 0) {
      return false
    }
  }
  return true
})

/* whether to show closest time as default aggregate*/
const hasClosestTime = computed(() => {
  if (props.timing) {
    if (props.timing.start.interval.type == "day" && props.timing.start.interval.length == 1) {
      return true
    }
    if (props.timing.end.interval.type == "day" && props.timing.end.interval.length == 1) {
      return true
    }
    if (props.timing.repeat_interval &&
        props.timing.repeat_interval.type == "day" &&
        props.timing.repeat_interval.length == 1) {
      return true
    }
    if (props.timing.start.type ==='date' && props.timing.end.type ==='date' &&
        (props.timing.start.duster_field_name === props.timing.end.duster_field_name ||
            props.timing.start.redcap_field_name === props.timing.end.redcap_field_name)
    ) {
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

const showClosestTime = computed(() => {
  // show closest event if it's selected as a default
  let show = false
  if (hasClosestTime.value && localAggregateDefaults.value) {
    show = (localAggregateDefaults.value.findIndex(agg => agg.value === 'closest_time') > -1)
    // show closest time if it's selected as a custom aggregate in labs
    if (!show) {
      show = localClinicalData.value.labs.findIndex((cd: any) =>
          (cd.selected && cd.aggregate_type === 'custom' &&
              (JSON.stringify(cd.aggregates).indexOf("closest_time") > -1))) > -1
    }
    // show closest time if it's selected as a custom aggregate in vitals
    if (!show) {
      show = localClinicalData.value.vitals.findIndex((cd: any) =>
          (cd.selected && cd.aggregate_type === 'custom' &&
              (JSON.stringify(cd.aggregates).indexOf("closest_time") > -1))) > -1
    }
  }
  return show
})

watchEffect(() => {
  if (!showClosestTime.value) {
    closestCalendarTime.value = ""
    closestTime.value = undefined
  }
})

watchEffect(() => {
  if (closestCalendarTime.value) {
    let toDate = new Date(closestCalendarTime.value)
    closestTime.value = ("0" + toDate.getHours()).slice(-2)
        + ":" + ("0" + toDate.getMinutes()).slice(-2)
        + ":00"
  } else {
    closestTime.value = "00:00:00"
  }
})

const defaultAggregatesRequired = computed(() => {
  let hasDefaults = (localClinicalData.value.labs.findIndex((cd: any) =>
      (cd.selected && cd.aggregate_type == 'default')) > -1)

  if (!hasDefaults) {
    hasDefaults = (localClinicalData.value.vitals.findIndex((cd: any) =>
        (cd.selected && cd.aggregate_type === 'default')) > -1)
  }
  return hasDefaults
  }
)

const timeFormat = helpers.regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)

const validationFields = computed(() => {
  return {
    aggregateDefaults: localAggregateDefaults.value,
    closestEventValue: (localClosestEvent.value.duster_field_name)
        ? localClosestEvent.value.duster_field_name :
        localClosestEvent.value.redcap_field_name,
   closestTime: closestTime.value
  }
})

const rules = computed(() =>({
  aggregateDefaults: {
    requiredIf: helpers.withMessage(
        "At least one default aggregate must be selected.",
        requiredIf(defaultAggregatesRequired.value)
    ),
    minLength: minLength(1)
  },
  closestEventValue: {
      requiredIf: helpers.withMessage(
          "Closest event is required", requiredIf(showClosestEvent.value))
    },
    closestTime: {
      requiredIf: helpers.withMessage("Closest time is required",
        requiredIf(showClosestTime.value)),
      timeFormat: helpers.withMessage("Incorrect time format",
          timeFormat)
    }
})
)
const v$ = useVuelidate(rules, validationFields,{ $stopPropagation: true })

const toast = useToast();

const saveClinicalData = () => {
  v$.value.$touch() ;
  if (!v$.value.$error) {
    visible.value = false
    emit('saveClinicalDataUpdate')
  } else {
    v$.value.$errors.forEach(error =>
      toast.add({
        severity: 'error',
        summary: 'Missing values', detail: error.$message,
        life: 3000
      })
    )
  }
}

const cancelClinicalData = () => {
  visible.value = false
  emit('cancelClinicalDataUpdate')
}

/**** validation rules and messages *****/


/* can't get vee-validate working with checkboxes.  this is diy solution **
const aggOptionErrorMessage = computed(() => {
  if (localAggregateDefaults.value
      && localAggregateDefaults.value.length) {
    return ""
  } else {
    // check selected options to see if any have defaults
    let hasDefaults = (localClinicalData.value.labs.findIndex((cd: any) =>
        (cd.selected && cd.aggregate_type == 'default')) > -1)

    if (!hasDefaults) {
      hasDefaults = (localClinicalData.value.vitals.findIndex((cd: any) =>
          (cd.selected && cd.aggregate_type === 'default')) > -1)
    }
    return hasDefaults ? "At least one default aggregate must be selected." : ""
  }
})

const closestEventError = computed(() => {
  if (showClosestEvent.value &&
      (!closestEvent.value ||
          !(closestEvent.value[0].duster_field_name || closestEvent.value[0].redcap_field_name)
      )
  ) {
    return "Closest event is required"
  }
  return ""
})

const closestTimeError = computed(() => {
  if (showClosestTime.value) {
    if (!closestTime.value || !closestTime.value.length) {
      return "Closest time is required"
    }
    return hasTimeFormat(closestTime.value ?? "")
  }
  return ""
})

const hasTimeFormat = (value: string) => {
  // Check if time format
  if (!/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/.test(value)) {
    return 'This field must follow 00:00:00 time format';
  }
  return "";
}*/


/**** selected/unselected options****/
const selectOptions = ref<string[]>(['Selected', 'Unselected', 'All'])
const selectFilter = ref<string>("All")
/****/

/* expand or collapse different sections */
/* these controls are currently commented out*/
const activeClinicalOptions = computed({
  get() {
    return props.activeOptions
  },
  set(value) {
    emit('update:activeOptions', value)
  }
})

const expandAll = () => {
  activeClinicalOptions.value = [0,1,2,3]
}
/****/

</script>

<style scoped>

</style>
