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
                :name="eventType + 'TimeType'"
                :inputId="type.value"
                :id="type.value"
                :value="type.value"
                :class="{ 'p-invalid': v$.type.$error }"
                @click="$emit('instigate', eventType)"
                @change="event.label = eventLabel; emit('clearPreset')"
            />
            <label :for="type.value" class="ml-2" v-tooltip="type.tooltip"
            >{{ type.text }}</label>
          </div>
          <div v-if="type.value === event.type && type.value.indexOf('date') > -1" class="formgroup-inline">
            <div class="field">
              <label
                  v-if="event.type==='date' && eventType==='start'">
                00:00:00 of
              </label>
              <label
                  v-else-if="event.type==='date' && eventType==='end'">
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

            </div>
            <div v-if="selectedEvent && selectedEvent.duster_field_name" class="field">
              <label> based on </label> <!--{{ selectedEvent.preposition }}&nbsp;-->
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
            </div>
          </div>
          <!-- interval options-->
          <div v-if="type.value === event.type && type.value === 'interval'" class="formgroup-inline">
            <div class="field ">
            <InputNumber
                v-model="intervalLength"
                id="intervalLength"
                input-id="integeronly"
                :min="1"
                :class="{ 'p-invalid': v$.interval['length'].$error }"
                :input-style="{'width': '3rem'}"
                placeholder="# of"
                @value="emit('clearPreset')"/>
              <small v-if="v$.interval['length'].$error"
                     class="flex p-error mb-3">
                {{ v$.interval.length.$errors[0].$message }}
              </small>
            </div>

            <div class="field ">
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
import {capitalize, computed, ref, watch, watchEffect} from "vue";
import type {PropType} from "vue";
import type {MenuOption} from "@/types/TextValuePair";
import type TimingConfig from "@/types/TimingConfig";
import type {TIMING_TYPE, INTERVAL_TYPE} from "@/types/TimingConfig";
import type FieldConfig from "@/types/FieldConfig";
import {INIT_TIMING_CONFIG, INIT_TIMING_INTERVAL, INTERVAL_OPTIONS} from "@/types/TimingConfig";
import {required, requiredIf, helpers} from "@vuelidate/validators";
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
  instigator: {
    type: String
  }
})

const emit = defineEmits(
    ['update:timingObject', 'clearPreset','instigate']
)

const event = computed({
  get() {
    return props.timingObject;
  },
  set(value) {
    emit('update:timingObject', value)
  }
});

/* restrict type options based on selections
**All options always available for "start"**
if otherTimingEvent has type interval, than this timing event can not have type interval
if otherTimingEvent has type date, then this timing event should also have type date,
or an interval of type calendar day
if otherTimingEvent has type datetime, then this timing event should also have type datetime or an interval
of type hour
 */
const filteredTimingTypes = computed( () => {
  if (props.eventType === 'end' && props.otherTimingEvent.type) {
      // match the type of start
      if (props.otherTimingEvent.type.indexOf('date') > -1) {
        return props.timeTypeOptions.filter(opt => (opt.value == props.otherTimingEvent.type
            || opt.value == 'interval'))
      } else if (props.otherTimingEvent.type === 'interval' && props.otherTimingEvent.interval?.type) {
        const dateType = (props.otherTimingEvent.interval.type === 'day') ? "date" : "datetime"
        return props.timeTypeOptions.filter(opt =>
            opt.value === dateType)
      }
  } else if (props.otherTimingEvent.type === 'interval') {
    return props.timeTypeOptions.filter(opt => opt.value !== 'interval')
  }
  return props.timeTypeOptions
})

const filteredIntervalOptions = computed(() => {
  if (props.eventType === 'end') {
    if (props.otherTimingEvent.type === 'datetime') {
      return INTERVAL_OPTIONS.filter(opt => opt.value === 'hour')
    } else if (props.otherTimingEvent.type === 'date') {
      return INTERVAL_OPTIONS.filter(opt => opt.value === 'day')
    }
  }
      return INTERVAL_OPTIONS
})

// select event type based on selection of other event
// Interval type is selected in different watchEffect method
// props.instigator tracks who initiated the type change so we don't keep going around in circles
watchEffect(() =>{
  // if there's only one value option, then select it.
  if (filteredTimingTypes.value.length === 1) {
    // @ts-nocheck
    event.value.type = filteredTimingTypes.value[0].value as TIMING_TYPE
  } else if (props.eventType != props.instigator
      && props.otherTimingEvent.type
      && props.otherTimingEvent.type !== event.value.type
      && props.otherTimingEvent.type !== 'interval'
      && event.value.type !== 'interval') {
    event.value.type = props.otherTimingEvent.type
  }
})

// if the event type is datetime, only return list of datetimes
// also filter out any options that don't have redcap_field_names
const filteredEventOptions = computed(() => {
  if (event.value.type === 'datetime')
      return props.eventOptions
          .filter(option => option
              && option.value_type
              && (option.duster_field_name || option.redcap_field_name)
              && option.value_type === 'datetime')
  else
    return props.eventOptions
        .filter(option => option
            && option.value_type
            && (option.duster_field_name || option.redcap_field_name)
        )
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
    if (!intervalType.value) {
      if (props.otherTimingEvent.type === 'datetime') {
        intervalType.value = 'hour'
      } else if (props.otherTimingEvent.type === 'date') {
        intervalType.value = 'day'
      }
    }
    // note to self: event.value.interval.label was incorrect value when two statements were combine
    event.value.interval.label = intervalLength.value.toString() + " " + intervalType.value
    event.value.interval.label += (props.eventType == 'start') ? "(s) before End"
      : "(s) after Start"
  event.value.label = event.value.interval.label
  }
})

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

const eventTypeLabel = computed<string>(() => {
  if (props.typeLabel) {
    return props.typeLabel
  } else {
    return capitalize(props.eventType) + " at: "
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

/*** vuelidate*/

/* Validation Rules */


const positiveInteger = helpers.regex(/^[1-9][0-9]*$/)

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
    requiredIf: helpers.withMessage('Required ' + capitalize(props.eventType) + " Event",
        requiredIf(event.value.type !== 'interval'))
  },
  interval: {
    requiredIf: requiredIf(event.value.type == 'interval'),
    type: {
      requiredIf: helpers.withMessage('Required',
          requiredIf(event.value.type == 'interval'))
    },
    length: {
      requiredIf: helpers.withMessage('Value must be a positive integer',
          requiredIf(event.value.type == 'interval')),
      positiveInteger: helpers.withMessage('Value must be a positive integer',
          positiveInteger)
    }
  },
  rp_date: {
    requiredIf: helpers.withMessage('Required',
        requiredIf(!!event.value.duster_field_name))
  }
})
)
const v$ = useVuelidate(rules, validationState)

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
