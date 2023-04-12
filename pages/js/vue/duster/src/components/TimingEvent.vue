<template>
  <div class="card">
    <div class="flex flex-wrap gap-3 mt-4">
      <div v-for="type in timeTypeOptions"
           :key="type.value"
           class="flex align-items-center">
        <RadioButton
            v-model="event.type"
            :inputId="type.value"
            :id="type.value"
            name="startTimeType"
            :value="type.value"
            :disabled="type.value ==='interval' &&
                  ((eventType == 'start' && endTimingObject.type=='interval')
                  || (eventType == 'end' && startTimingObject.type=='interval')) "
            @change="event.label = eventLabel; emit('clearPreset')"
        />
        <label :for="type.value" class="ml-2">{{ type.text }}</label>
      </div>
    </div>

    <!-- interval options-->
    <div v-if="event.type=='interval'" class="card">

      <div class="flex flex-wrap gap-3 mt-4 ">
        <div class="flex align-items-center">
          {{ capitalizedEventType }}ing at&nbsp;<span class="p-float-label">
            <InputNumber
                v-model="event.interval.length"
                id="intervalLength"
                inputId="integeronly"
                @value="event.label = eventLabel; emit('clearPreset')"/>
          <label for="intervalLength">
            Length of Interval
          </label>
          </span>
        </div>
        <div v-for="type in INTERVAL_OPTIONS"
             :key="type.value"
             class="flex align-items-center">
          <RadioButton
              v-model="event.interval.type"
              :inputId="type.value"
              name="interval"
              :id="eventType + '_' + type.value"
              :value="type.value"
              @change="event.label = eventLabel; emit('clearPreset')"/>
          <label class="ml-2">{{ type.text }}</label>
        </div>
        <span v-if="eventType == 'start' && endTimingObject" class="flex align-items-center">
          before {{ endTimingObject.label }}
        </span>
        <span v-if="eventType == 'end' && startTimingObject" class="flex align-items-center">
          after {{ startTimingObject.label }}
        </span>
      </div>
    </div>
    <!--date and datetime options-->
    <div v-else-if="(event.type == 'date' || event.type == 'datetime')"
         class="mt-4 flex flex-wrap gap-3">
      <div v-if="eventType !='event'"
          class="flex align-items-center">
        {{ capitalizedEventType }}ing at
      </div>
      <div v-if="event.type=='date'" class="flex align-items-center">
        00:00:00 of
      </div>
      <Dropdown v-model="selectedEvent"
                :options="eventOptions"
                optionLabel="label"
                class="flex align-items-center"
                @change="event.label = eventLabel; emit('clearPreset')"/>
      <div v-if="selectedEvent && selectedEvent.duster_field_name" class="flex align-items-center">
        {{ selectedEvent.preposition }}&nbsp;
        <Dropdown v-model="event.rp_date"
                  :options="rpDates"
                  optionLabel="label"
                  optionValue="redcap_field_name"/>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import {computed} from "vue";
import type {PropType} from "vue";
import type TextValuePair from "@/types/TextValuePair";
import type TimingConfig from "@/types/TimingConfig";
import type FieldConfig from "@/types/FieldConfig";
import {INIT_TIMING_CONFIG, INTERVAL_OPTIONS} from "@/types/TimingConfig";

const props = defineProps({
  timeTypeOptions: {
    type: Array as PropType<Array<TextValuePair>>,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  eventOptions: {
    type: Array as PropType<Array<TimingConfig>>,
    required: true
  },
  rpDates: {
    type: Object as PropType<FieldConfig>,
    required: true
  },
  timingObject: {
    type: Object as PropType<TimingConfig>,
    required: true
  },
  startTimingObject: Object as PropType<TimingConfig>,
  endTimingObject: Object as PropType<TimingConfig>
})

const emit = defineEmits(
    ['update:timingObject','clearPreset']
)

const event = computed({
  get() {
    return props.timingObject;
  },
  set(value) {
    emit('update:timingObject', value)
  }
});

const capitalizedEventType = computed<string>(() => {
  return props.eventType.charAt(0).toUpperCase() + props.eventType.slice(1)
})

const selectedEvent = computed<TimingConfig>({
  get() {
    if (event.value) {
      if (event.value.duster_field_name) {
        let dusterFieldName = event.value.duster_field_name
        let index = props.eventOptions.findIndex((dttm) => dttm.duster_field_name ==
            dusterFieldName)
        return props.eventOptions[index]
      } else if (event.value.redcap_field_name) {
        let redcapFieldName = event.value.redcap_field_name
        let index = props.eventOptions.findIndex((dttm) => dttm.redcap_field_name ==
            redcapFieldName)
        return props.eventOptions[index]
      }
    }
    return INIT_TIMING_CONFIG
  },
  set(value) {
    if (event.value) {
      event.value.preposition = value.preposition
      event.value.value_type = value.value_type
      event.value.redcap_field_type = value.redcap_field_type
      if (value.duster_field_name) {
        event.value.duster_field_name = value.duster_field_name
      } else if (value.redcap_field_name) {
        event.value.redcap_field_name = value.redcap_field_name
      }
    }
  }
})

const eventLabel = computed(() => {
  let label: string = ""
  if (event.value.type == 'interval'
      && event.value.interval
      && event.value.interval.length
      && event.value.interval.type) {
    label = event.value.interval.length +
        " " + event.value.interval.type
    if (event.value.event_type == 'start')
      label += " before End"
    if (event.value.event_type == 'end')
      label += " after Start"
    return label
  }
  label = getDateText(props.eventOptions, event.value.duster_field_name,
      event.value.redcap_field_name) || ""
  if (event.value && event.value.type == 'datetime') {
    return label
  }
  if (event.value.type == 'date') {
    if (event.value.event_type == "end") {
      return "23:59:00 of " + label
    } else {
      return "00:00:00 of " + label
    }
  }
  return "Unknown"
})


const getDateText = (options: TimingConfig[], dusterFieldName?: string | null, redcapFieldName?: string | null) => {
  if (dusterFieldName) {
    let option = options.find(opt => opt.duster_field_name === dusterFieldName)
    if (option) return option.label
  } else if (redcapFieldName) {
    let option = options.find(opt => opt.redcap_field_name === redcapFieldName)
    if (option) return option.label
  }
  return ""
}

/*const onTimingChange=()=> {
  event.value.label = eventLabel
  emit('clearPreset')
}*/

</script>

<style scoped>

</style>
