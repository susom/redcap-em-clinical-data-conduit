<template>
  <div class="field grid">

    <label class="col-12 mb-2 md:col-2 md:mb-0">{{ eventTypeLabel }}
      <i class="ml-2 pi pi-info-circle" style="color:blue"
      v-tooltip="eventTooltip"></i></label>
    <div class="col-12 md:col-10">
      <div class="formgroup">

        <div v-for="type in filteredTimingTypes" :key="type.value" class="formgroup-inline">
          <div class="field-radiobutton mt-1">
            <RadioButton
                v-model="event.type"
                name="startTimeType"
                :inputId="type.value"
                :id="type.value"
                :value="type.value"
                :class="{ 'p-invalid': v$.type.$error }"
                @change="event.label = eventLabel; emit('clearPreset')"
            />
            <label :for="type.value" class="ml-2" v-tooltip="type.tooltip"
            >{{ type.text }}</label>
          </div>
          <div v-if="type.value === event.type && type.value.indexOf('date') > -1" class="formgroup-inline">
            <div class="field">
              <label v-if="event.type==='date' && eventType==='start'">
                00:00:00 of
              </label>
              <label v-else-if="event.type==='date' && eventType==='end'">
                23:59:00 of
              </label>
              <Dropdown v-model="selectedEvent"
                        :options="filteredEventOptions"
                        optionLabel="label"
                        style="width:12rem"
                        :class="{ 'p-invalid': v$.eventValue.$error }"
                        @change="event.label = eventLabel; emit('clearPreset')"
              />
              <small v-if="v$.eventValue.$error"
                     class="flex p-error mb-3">
                {{ v$.eventValue.$errors[0].$message }}
              </small>

              <!--small v-if="selectedEventMissing"
                     class="flex p-error mb-3">
                {{ selectedEventMissing }}
              </small-->
              <!-- can't use DropdownWithValidation component here because it's returning an object>
              <Field v-slot="{ field, errorMessage }"
                     name="selectedEvent"
                     v-model="selectedEvent"
                     :rules="required"
              >
                <Dropdown
                    v-bind="field"
                    :options="filteredEventOptions"
                    :class="{ 'p-invalid': errorMessage }"
                    :modelValue="field.value"
                    optionLabel="label"
                    placeholder="Select an event"
                    @input="field.onInput.forEach((fn) => fn($event.value))"
                    @change="field.onChange.forEach((fn) => fn($event.value))"                />
                <small class="p-error">{{ errorMessage || '&nbsp;' }}</small>
              </Field-->

            </div>
            <div v-if="selectedEvent && selectedEvent.duster_field_name" class="field">
              <label> based on </label> <!--{{ selectedEvent.preposition }}&nbsp;-->
              <!--DropdownWithValidation
                  name="event.rp_date"
                  v-model="event.rp_date"
                  :options="rpDates"
                  option-label="label"
                  option-value="redcap_field_name"
                  placeholder="Select an event"
                  rules="required"
                  style="width:8rem"
              /-->
              <Dropdown v-model="event.rp_date"
                        :options="rpDates"
                        optionLabel="label"
                        optionValue="redcap_field_name"
                        style="width:12rem"
                        :class="{ 'p-invalid': v$.rp_date.$error }"
              />
              <small v-if="v$.rp_date.$error"
                     class="flex p-error mb-3">
                {{ v$.rp_date.$errors[0].$message }}
              </small>

              <!--small v-if="rpDateMissing"
                     class="flex p-error mb-3">
                {{ rpDateMissing }}
              </small-->
            </div>
          </div>
          <!-- interval options-->
          <div v-if="type.value === event.type && type.value === 'interval'" class="formgroup-inline">
            <div class="field ">
                          <!--InputTextWithValidation
                              id="intervalLength"
                              name="event.interval.length"
                              v-model="event.interval.length"
                              classDef="w-full md:w-3rem"
                              rules="required|integer"
                              placeholder="# of"
                              @value="event.label = eventLabel; emit('clearPreset')"
                          /-->
            <InputNumber
                v-model="intervalLength"
                id="intervalLength"
                input-id="integeronly"
                style="width:3rem"
                :class="{ 'p-invalid': v$.interval['length'].$error }"
                @value="emit('clearPreset')"/>
              <small v-if="v$.interval['length'].$error"
                     class="flex p-error mb-3">
                {{ v$.interval.length.$errors[0].$message }}
              </small>

              <!--small v-if="eventIntervalLengthMissing"
                     class="flex p-error mb-3">
                {{ eventIntervalLengthMissing }}
              </small-->
            </div>

            <div class="field ">
              <!--DropdownWithValidation
                  name="event.interval.type"
                  v-model="event.interval.type"
                  :options="INTERVAL_OPTIONS"
                  option-label="text"
                  option-value="value"
                  classDef="w-full md:w-10rem"
                  rules="required"
                  placeholder="Hours / Days"
                  @change="event.label = eventLabel; emit('clearPreset')"
              /-->
              <Dropdown v-model="intervalType"
                        :options="filteredIntervalOptions"
                        optionLabel="text"
                        optionValue="value"
                        style="width:10rem"
                        placeholder="Hours / Days"
                        :class="{ 'p-invalid': v$.interval['type'].$error }"
                        @change="emit('clearPreset')"/>
              <small v-if="v$.interval['type'].$error"
                     class="flex p-error mb-3">
                {{ v$.interval.type.$errors[0].$message }}
              </small>

              <!--small v-if="eventIntervalTypeMissing"
                     class="flex p-error mb-3">
                {{ eventIntervalTypeMissing }}
              </small-->

            </div>
            <div class="field">
              <label v-if="eventType === 'start' && otherTimingEvent">
                before End ({{ otherTimingEvent.label }})
              </label>
              <label v-if="eventType === 'end' && otherTimingEvent">
                after Start ({{ otherTimingEvent.label }})
              </label>
            </div>
          </div>
        </div>
        <small v-if="v$.type.$error"
               class="flex p-error mb-3">
          {{ v$.type.$errors[0].$message }}
        </small>

        <!--small v-if="eventTypeMissing"
               class="flex p-error mb-3">
          {{ eventTypeMissing }}
        </small-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch, watchEffect} from "vue";
import type {PropType} from "vue";
import type {MenuOption} from "@/types/TextValuePair";
import type TimingConfig from "@/types/TimingConfig";
import type {INTERVAL_TYPE} from "@/types/TimingConfig";
import type FieldConfig from "@/types/FieldConfig";
import {INIT_TIMING_CONFIG, INIT_TIMING_INTERVAL, INTERVAL_OPTIONS} from "@/types/TimingConfig";
//import {defineRule, configure} from 'vee-validate'
//import { required } from '@vee-validate/rules';
//import {localize} from "@vee-validate/i18n";
import {required, integer, requiredIf, helpers} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const props = defineProps({
  timeTypeOptions: {
    type: Array as PropType<Array<MenuOption>>,
    required: true
  },
  typeLabel: String,
  eventType: {
    type: String,
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
  timingObject: {
    type: Object as PropType<TimingConfig>,
    required: true
  },
  otherTimingEvent: {
    type: Object as PropType<TimingConfig>,
    required: true
  },
  submitted: Boolean
})

const emit = defineEmits(
    ['update:timingObject', 'clearPreset']
)

const event = computed({
  get() {
    return props.timingObject;
  },
  set(value) {
    emit('update:timingObject', value)
  }
});

/* if otherTimingEvent has type interval, than this timing event can not have type interval
if otherTimingEvent has type date, then this timing event should also have type date,
or an interval of type calendar day
if otherTimingEvent has type datetime, then this timing event should also have type datetime or an interval
of type hour
 */
const filteredTimingTypes = computed( () => {
  if (props.otherTimingEvent.type === 'interval') {
    return props.timeTypeOptions.filter(opt => opt.value !== 'interval')
  }
  else if (props.eventType === 'end'
      && props.otherTimingEvent.type
      && props.otherTimingEvent.type.indexOf('date') > -1) {
    return props.timeTypeOptions.filter(opt => (opt.value == props.otherTimingEvent.type
        || opt.value == 'interval'))
  }
  return props.timeTypeOptions
})

const filteredIntervalOptions = computed(() => {
      if (props.otherTimingEvent.type === 'datetime') {
        return INTERVAL_OPTIONS.filter(opt => opt.value === 'hour')
      } else if (props.otherTimingEvent.type === 'date') {
        return INTERVAL_OPTIONS.filter(opt => opt.value === 'day')
      }
      return INTERVAL_OPTIONS
    }
)

// match the date types of one event to the other if they are both date types
watch(props.otherTimingEvent, (newOtherEvent) => {
  if (((newOtherEvent?.type ?? "").indexOf("date") > -1)
      && event.value.type
      && event.value.type.indexOf("date") > -1) {
    event.value.type = newOtherEvent.type
  }

})


// if the event type is datetime, only return list of datetimes
const filteredEventOptions = computed(() => {
  if (event.value.type === 'datetime')
      return props.eventOptions.filter(event => event.value_type === 'datetime')
  else
    return props.eventOptions
    }
)

const intervalType = computed({
  get() {
    return event.value.interval?.type
  },
  set(value:INTERVAL_TYPE) {
      if (!event.value.interval) {
        event.value.interval = {...INIT_TIMING_INTERVAL}
      }
      event.value.interval.type = value
  }
})

const intervalLength = computed({
  get() {
    return event.value.interval?.length ?? 0
  },
  set(value:number) {
    if (!event.value.interval) {
      event.value.interval = {...INIT_TIMING_INTERVAL}
    }
    event.value.interval.length = value
  }
})

watchEffect(()=> {
  if (event.value.type == 'interval') {
    if (!event.value.interval) {
      event.value.interval = {...INIT_TIMING_INTERVAL}
    }
    if (props.otherTimingEvent.type === 'datetime') {
      intervalType.value = 'hour'
    } else if (props.otherTimingEvent.type === 'date') {
      intervalType.value = 'day'
    }
    // note to self: event.value.interval.label was incorrect value when two statements were combine
    event.value.interval.label = intervalLength.value.toString() + " " + intervalType.value
    event.value.interval.label += (props.eventType == 'start') ? "(s) before End"
      : "(s) after Start"
  event.value.label = event.value.interval.label
  }
})

/*watch([intervalLength, intervalType],
    ([newIntervalLength, newIntervalType]) => {
  if (event.value.type == 'interval') {
    if (!event.value.interval) {
      event.value.interval = {...INIT_TIMING_INTERVAL}
    }
    //event.value.interval.type = newIntervalType
    //event.value.interval.length = newIntervalLength
    event.value.interval.label = newIntervalLength.toString() + " " + newIntervalType
    event.value.interval.label += (props.eventType == 'start') ? "(s) before End"
          : "(s) after Start"
    event.value.label = event.value.interval.label
  }
    })*/


const selectedEvent = computed<TimingConfig>({
  get() {
    if (event.value) {
      if (event.value.duster_field_name) {
        let dusterFieldName = event.value.duster_field_name
        let index = props.eventOptions.findIndex((dttm) => dttm.duster_field_name ==
            dusterFieldName)
        return props.eventOptions[index]
      } else { // rp_date
        let rpDate = event.value.redcap_field_name
        let index = props.eventOptions.findIndex((dttm) => !dttm.duster_field_name
            && dttm.redcap_field_name == rpDate)
        if (index > -1)
          return props.eventOptions[index]
      }
    }
    return JSON.parse(JSON.stringify(INIT_TIMING_CONFIG))
  },
  set(value) {
    if (event.value) {
      //event.value.preposition = value.preposition
      event.value.redcap_field_type = value.redcap_field_type
      if (value.duster_field_name) {
        event.value.duster_field_name = value.duster_field_name
        event.value.redcap_field_name = undefined
        if (!event.value.rp_date) {
          event.value.rp_date = props.rpDates[0].redcap_field_name
        }
      } else if (value.redcap_field_name) {
        event.value.redcap_field_name = value.redcap_field_name
        //event.value.rp_date = value.redcap_field_name ??
        event.value.duster_field_name = undefined
        event.value.rp_date = undefined
      }
    }
  }
})

const capitalizedEventType = computed<string>(() => {
  return props.eventType.charAt(0).toUpperCase() + props.eventType.slice(1)
})

const eventTypeLabel = computed<string>(() => {
  if (props.typeLabel) {
    return props.typeLabel
  } else {
    return capitalizedEventType.value + " at: "
  }
})

const eventLabel = computed(() => {
  if (event.value.type == 'interval') {
    return intervalLength.value.toString() + " "
    + intervalType.value
    + (props.eventType == 'start') ?  "(s) before End"
        : "(s) after Start"
    //return event.value.interval?.label ?? ""
  }
  const label = getDateText(props.eventOptions, event.value.duster_field_name,
          event.value.redcap_field_name) ?? ""
  if (label.length && event.value.type == 'date') {
    return (props.eventType == 'end')
        ? "23:59:00 of " + label
        : "00:00:00 of " + label
  }
  return label
})

const getDateText = (options: TimingConfig[],
                     dusterFieldName?: string ,
                     rpDate?: string) => {
  if (dusterFieldName) {
    let option = options.find(opt => opt.duster_field_name === dusterFieldName)
    if (option) return option.label
  } else if (rpDate) {
    let option = options.find(opt => opt.redcap_field_name === rpDate)
    if (option) return option.label
  }
  return ""
}

/*** vuelidate
 */

/* Validation Rules */


const nonNegativeInteger = helpers.regex(/^[0-9]+$/)

const validationState = computed(() => {
  return {
    type: event.value.type,
    eventValue: (selectedEvent.value.duster_field_name) ? selectedEvent.value.duster_field_name : selectedEvent.value.redcap_field_name,
    interval: event.value.interval,
    rp_date: event.value.rp_date
  }
})


const rules = computed(() => ( {
  type: { required: helpers.withMessage('Required', required) },
  eventValue: {
    requiredIf: helpers.withMessage('Required ' + capitalizedEventType.value + " Event",
        requiredIf(event.value.type !== 'interval'))
  },
  interval: {
    requiredIf: requiredIf(event.value.type == 'interval'),
    type: {
      requiredIf: helpers.withMessage('Required',
          requiredIf(event.value.type == 'interval'))
    },
    length: {
      requiredIf: helpers.withMessage('Required',
          requiredIf(event.value.type == 'interval')),
      nonNegativeInteger: helpers.withMessage('Value must be a non-negative integer',
          nonNegativeInteger)
    }
  },
  rp_date: {
    requiredIf: helpers.withMessage('Required',
        requiredIf(!!event.value.duster_field_name))
  }
})
)
const v$ = useVuelidate(rules, validationState)

/***********/

/*validation rule and messages*/
/*const eventRequired = computed(() =>{
  return !event.value.duster_field_name
      && !event.value.redcap_field_name
      && !(event.value.type === 'interval')
})

const eventTypeMissing = computed(() =>{
  if (props.submitted && !event.value.type) {
    return "Event type required."
  }
  return ""
})

const selectedEventMissing = computed(() =>{
  if (props.submitted && (!selectedEvent.value ||
      (!selectedEvent.value.duster_field_name && !selectedEvent.value.redcap_field_name))) {
    return "Event required"
  }
  return ""
})

const rpDateMissing = computed(() => {
  if (props.submitted && !selectedEventMissing.value.length && !event.value.rp_date) {
    return "Researcher provided date required"
  }
  return ""
})

const eventIntervalLengthMissing = computed(() => {
  if (props.submitted && event.value.type === 'interval'
      && (event.value.interval?.length ?? 0) <= 0) {
    return "Interval length must be a positive integer"
  }
  return ""
})

const eventIntervalTypeMissing = computed(() => {
  if (props.submitted && event.value.type === 'interval'
      && !event.value.interval?.type) {
    return "Interval type required"
  }
  return ""
})*/

watchEffect(() => {
  if (props.submitted) {
    v$.value.$touch() ;
    //console.log("Validation errors :" + v$.value.$error) ;
    console.log('timing event ' + v$.value)
  }
})

const eventTooltip = computed(() => {
  if (props.eventType == 'start') {
    return "Some description about start"
  } else {
    return "Some description about end"
  }
})

</script>

<style scoped>

</style>
