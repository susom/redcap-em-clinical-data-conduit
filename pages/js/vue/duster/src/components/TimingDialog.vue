<template>
  <Dialog v-model:visible="visible"
          :modal="true"
          :style="{ width: '75vw' }"
           header="Data Collection Timing"
          class="my-2"
  >
    <div class="field grid mt-2">
      <label class="col-2" for="presets">Presets: <i class="ml-2 pi pi-info-circle" style="color:blue"
                                                           v-tooltip="'Common preset configurations'"></i></label>
      <Dropdown
          class="col-6"
          :options="presets"
          id="presets"
          v-model="selectedPreset"
          optionLabel="label"/>
    </div>
    <Divider/>
    <div class="card">
      <TimingEvent
          v-model:timing-object="cw.timing.start"
          event-type="start"
          :time-type-options="START_TIME_TYPE_OPTIONS"
          :event-options="eventOptions"
          :rp-dates="rpDates"
          :other-timing-event="cw.timing.end"
          :submitted="submitted"
          @clear-preset="clearPreset"
      />
    </div>
    <Divider/>
    <div class="card">
      <TimingEvent
          v-model:timing-object="cw.timing.end"
          event-type="end"
          :time-type-options="END_TIME_TYPE_OPTIONS"
          :event-options="eventOptions"
          :rp-dates="rpDates"
          :other-timing-event="cw.timing.start"
          :submitted="submitted"
          @clear-preset="clearPreset"
      />
    </div>
    <Divider/>
    <div class="card">
      <div class="field grid">
        <div class="col-offset-2 col-12 md:col-10">

          <Checkbox
              id="hasRepeatIntervals"
              v-model="hasRepeatIntervals"
              :binary="true"/>
          <label
              class="ml-2"
              for="hasRepeatIntervals">
            Repeat Data Collection at defined intervals between Start & End?
            <i class="ml-2 pi pi-info-circle" style="color:blue"
               v-tooltip="'Collect data multiple times in the collection window at the defined intervals '"></i>
          </label>

        </div>
      </div>
      <div v-if="hasRepeatIntervals" class="field grid">

        <div class="col-12 mb-2 md:col-2 md:mb-0">
          <label>Collect Data Every: </label>
        </div>
        <div class="col-12 md:col-10">
          <div class="formgroup-inline">
            <div class="field ">

          <span class="p-float-label">
            <InputNumber
                v-model="repeatIntervalLength"
                id="repeatIntervalLength"
                input-id="integeronly"
                :class="{ 'p-invalid': v$.repeatIntervalLength.$error }"
                style="width:3rem"/>
          <label for="repeatIntervalLength" style="width:3rem">
            # of
          </label>
          </span>
              <!--small v-if="repeatIntervalLengthMissing"
                     class="flex p-error mb-3">
                {{ repeatIntervalLengthMissing }}
              </small-->
              <small v-if="v$.repeatIntervalLength.$error"
                     class="flex p-error mb-3">
                {{ v$.repeatIntervalLength.$errors[0].$message }}
              </small>
            </div>
            <div class="field ">
              <Dropdown v-model="repeatIntervalType"
                        :options="filteredIntervalOptions"
                        optionLabel="text"
                        optionValue="value"
                        placeholder="Hours/Days"
                        :class="['ml-1 mr-2', { 'p-invalid': v$.repeatIntervalType.$error }]"
                        />
              <label> between Start and End Date/Datetimes</label>
              <small v-if="v$.repeatIntervalType.$error"
                     class="flex p-error mb-3">
                {{ v$.repeatIntervalType.$errors[0].$message }}
              </small>
              <!--small v-if="repeatIntervalTypeMissing"
                     class="flex p-error mb-3">
                {{ repeatIntervalTypeMissing }}
              </small-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
    <template #footer>
      <Button label="Save" class="p-button-success" icon="pi pi-check" text @click="submitted= true;saveTiming()"/>
      <Button label="Cancel" class="p-button-danger" icon="pi pi-times" text @click="cancelTiming"/>
      <Button label="Reset" class="p-button" text @click="resetTiming"/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, watchEffect, watch,  ref} from "vue";
import type {PropType} from "vue";
import type CollectionWindow from "@/types/CollectionWindow";
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";
import type {INTERVAL_TYPE} from "@/types/TimingConfig";
import {START_TIME_TYPE_OPTIONS, END_TIME_TYPE_OPTIONS, INTERVAL_OPTIONS, INIT_TIMING_INTERVAL, INIT_TIMING_CONFIG} from
      "@/types/TimingConfig";
import TimingEvent from "./TimingEvent.vue"
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast'
import { useVuelidate } from '@vuelidate/core'
import {requiredIf, helpers} from '@vuelidate/validators'


const props = defineProps({
  collectionWindow: {
    type: Object as PropType<CollectionWindow>,
    required: true
  },
  presets: {
    type: Array as PropType<Array<Object>>,
    required: true
  },
  eventOptions: {
    type: Array as PropType<Array<TimingConfig>>,
    required: true
  },
  rpDates: {
    type: Array as PropType<Array<FieldConfig>>,
    required: true
  },
  showTimingDialog: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(
    ['update:showTimingDialog', 'update:collectionWindow', 'saveTimingUpdate',
      'cancelTimingUpdate']
)

const visible = computed({
  get() {
    return props.showTimingDialog;
  },
  set(value) {
    emit('update:showTimingDialog', value)
  }
});

const cw = computed({
  get() {
    return props.collectionWindow;
  },
  set(value) {
    emit('update:collectionWindow', value)
  }
});

/*****  repeat interval *****/

const filteredIntervalOptions = computed(() => {
      if (cw.value.timing.start.type === 'datetime' || cw.value.timing.end.type === 'datetime') {
        return INTERVAL_OPTIONS.filter(opt => opt.value === 'hour')
      } else if (cw.value.timing.start.type  === 'date' || cw.value.timing.end.type === 'date') {
        return INTERVAL_OPTIONS.filter(opt => opt.value === 'day')
      }
      return INTERVAL_OPTIONS
    }
)

const repeatIntervalType = computed({
  get() {
    return cw.value.timing.repeat_interval?.type ?? undefined
  },
  set(value) {
    if (!cw.value.timing.repeat_interval) {
      cw.value.timing.repeat_interval = {...INIT_TIMING_INTERVAL}
    }
    cw.value.timing.repeat_interval.type = value
  }
})

const repeatIntervalLength = computed({
  get() {
    return cw.value.timing.repeat_interval?.length ?? undefined
  },
  set(value) {
    if (!cw.value.timing.repeat_interval) {
      cw.value.timing.repeat_interval = {...INIT_TIMING_INTERVAL}
    }
    cw.value.timing.repeat_interval.length = value
  }
})

watchEffect(() => {
  if (cw.value.timing.repeat_interval &&
      repeatIntervalLength.value && repeatIntervalLength.value >= 0
      && repeatIntervalType.value)
  cw.value.timing.repeat_interval.label = "Every " + repeatIntervalLength.value
      + " " + repeatIntervalType.value + "(s) "
})

const hasRepeatIntervals = ref<boolean>(false)
/*watch(hasRepeatIntervals, (updatedHasRepeatIntervals) =>
{
  if (hasRepeatIntervals.value) {
    cw.value.type = 'repeating'
    cw.value.timing.repeat_interval = {...INIT_TIMING_INTERVAL}
  } else {
    cw.value.type = 'nonrepeating'
    cw.value.timing.repeat_interval = undefined
    repeatIntervalLength.value = undefined
    repeatIntervalType.value = undefined
  }
})*/
watchEffect(() => {
  if (hasRepeatIntervals.value) {
    cw.value.type = 'repeating'
    cw.value.timing.repeat_interval = {...INIT_TIMING_INTERVAL}
  } else {
    cw.value.type = 'nonrepeating'
    cw.value.timing.repeat_interval = undefined
    repeatIntervalLength.value = undefined
    repeatIntervalType.value = undefined
  }
})

const selectedPreset = ref<CollectionWindow>()
// add a watch to selectedPresets
watchEffect(() => {
  if (selectedPreset.value) {
    cw.value.timing.start = JSON.parse(JSON.stringify(selectedPreset.value.timing.start))
    cw.value.timing.end = JSON.parse(JSON.stringify(selectedPreset.value.timing.end))
    cw.value.label = selectedPreset.value.label
    // select first rp_date for presets by default unless it has already been set to something else
    // this is okay because presets all have duster metadata
    if (!cw.value.timing.start.rp_date)
      cw.value.timing.start.rp_date = props.rpDates[0].redcap_field_name
    if (cw.value.timing.end && !cw.value.timing.end.rp_date)
      cw.value.timing.end.rp_date = props.rpDates[0].redcap_field_name
  }
})

const submitted = ref<boolean>(false)

const nonNegativeInteger = helpers.regex(/^[0-9]+$/)

const validationValues = computed(()=> {
  return {
    repeatIntervalLength: repeatIntervalLength.value,
    repeatIntervalType: repeatIntervalType.value,
  }
})
const rules = computed(() => ({
  repeatIntervalLength: {
    requiredIf: helpers.withMessage('Repeat interval length required',
        requiredIf(hasRepeatIntervals.value)),
    nonNegativeInteger: helpers.withMessage('Value must be a non-negative integer',
        nonNegativeInteger)
  },
  repeatIntervalType: {
      requiredIf: helpers.withMessage('Repeat interval type required',
          requiredIf(hasRepeatIntervals.value))
    }
}))

const v$ = useVuelidate(rules, validationValues)

const toast = useToast();
/*this requires one failed validation before it kicks in.  why???
const validationState = computed(() => {
  return (startTimingValid.value
  && endTimingValid.value
  && !repeatIntervalTypeMissing.value
  && !repeatIntervalLengthMissing.value)
})*/

/*const timingObjectIsValid = (timingObject: TimingConfig) => {
  return !!((timingObject.type !== 'interval'
          //should have either duster_field_name or redcap_field_name defined
          && (timingObject.duster_field_name || timingObject.redcap_field_name)
          //if duster_field_name then rp_date should be defined
          && (timingObject.duster_field_name ? timingObject['rp_date'] : true)
      )
      // if the start type is an interval
      || (timingObject.type === 'interval' ?
          // both interval type and length must be defined, length > 0
          (timingObject.interval && timingObject.interval.type &&
              ((timingObject.interval?.length ?? 0) > 0)) : true));

}

const validationState = computed<boolean>(() => {
  return (timingObjectIsValid(cw.value.timing.start)
      && timingObjectIsValid(cw.value.timing.end))
})*/

const saveTiming = () => {
  //emit('timingValidationUpdate', validationState.value)
  v$.value.$touch() ;
  submitted.value=true
  console.log("Validation errors :" + v$.value.$error) ;
  console.log(v$.value) ;
  clearPreset()
  if (!v$.value.$error) {
    cw.value.timing_valid = true
    visible.value = false
    emit('saveTimingUpdate')
  } else {
    cw.value.timing_valid = false
    v$.value.$errors.forEach(error =>
    toast.add({ severity: 'error', summary: 'Unable To Save', detail: error.$message, life: 3000
    })
    )
  }
}

const cancelTiming = () => {
  cw.value.timing_valid = !v$.value.$error
  v$.value.$reset()
  clearPreset()
  visible.value = false
  //emit('timingValidationUpdate', validationState.value )
  emit('cancelTimingUpdate')
}

const clearPreset = () => {
  selectedPreset.value = undefined
}

const resetTiming = () => {
  v$.value.reset()
  submitted.value = false
  clearPreset()
  cw.value.label = ""
  cw.value.type = "nonrepeating"
  cw.value.timing.start = JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
  cw.value.timing.end = JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
  repeatIntervalLength.value = undefined
  repeatIntervalType.value = undefined
  cw.value.timing.repeat_interval = {...INIT_TIMING_INTERVAL}
}

/*
const repeatIntervalLengthMissing = computed(() => {
  if (submitted.value &&
      hasRepeatIntervals.value
      && (cw.value.timing.repeat_interval?.length ?? 0) <= 0) {
    return "Interval length must be a positive integer"
  }
  return ""
})

const repeatIntervalTypeMissing = computed(() => {
  if (submitted.value &&
      hasRepeatIntervals.value
      && !cw.value.timing.repeat_interval?.type) {
    return "Interval type required"
  }
  return ""
})*/



</script>

<style scoped>


</style>
