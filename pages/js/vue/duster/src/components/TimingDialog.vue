<template>
  <Dialog v-model:visible="visible"
          :modal="true"
          header="Define Data Timing"
          class="my-2"
  >
    <div class="field grid">
      <label class="col-fixed" style="width:100px" for="presets">Presets: </label>
      <Dropdown
          class="col-6"
          :options="presets"
          id="presets"
          v-model="selectedPreset"
          optionLabel="label"/>

    </div>
    <!--div class="field grid">

      <label class="col-fixed" style="width:100px" for="label">Label: </label>
      <InputText class="col-6 py-2" id="label" v-model="cw.label"/>
    </div-->
    <Panel header="Start Collection">
      <TimingEvent
          :time-type-options="TIME_TYPE_OPTIONS"
          v-model:timing-object="cw.timing.start"
          event-type="start"
          :event-options="eventOptions"
          :rp-dates="rpDates"
          :end-timing-object="cw.timing.end"
          @clear-preset="clearPreset"

      />
      <!-- refactored into TimingEventComponent
      <div class="flex flex-wrap gap-3 mt-4">
        <div v-for="type in START_TIME_TYPE_OPTIONS"
             :key="type.value"
             class="flex align-items-center">
          <RadioButton
              v-model="cw.timing.start.type"
              :inputId="type.value"
              name="startTimeType"
              :value="type.value"
              :disabled="type.value ==='interval' && cw.timing.end.type=='interval'"
              @change="cw.timing.start.label = startLabel; selectedPreset=''"
          />
          <label :for="type.value" class="ml-2">{{ type.text }}</label>
        </div>
      </div-->

      <!-- interval options-->
      <!--div v-if="cw.timing.start.type=='interval'" class="card">

        <div class="flex flex-wrap gap-3 mt-4 ">
          <div class="flex align-items-center">
            Starting at&nbsp;<span class="p-float-label">
            <InputNumber
                v-model="cw.timing.start.interval.length"
                id="startIntervalLength"
                inputId="integeronly"
                @change="cw.timing.start.label = startLabel"/>
          <label for="startIntervalLength">
            Length of Interval
          </label>
          </span>
          </div>
          <div v-for="type in INTERVAL_OPTIONS"
               :key="type.value"
               class="flex align-items-center">
            <RadioButton
                v-model="cw.timing.start.interval.type"
                :inputId="type.value"
                name="startInterval"
                :id="'start_'+ type.value"
                :value="type.value"
                @change="cw.timing.start.label = startLabel"/>
            <label :for="'start_'+ type.value" class="ml-2">{{ type.text }}</label>
          </div>
          <div class="flex align-items-center">
            before {{ endLabel }}
          </div>
        </div>
      </div-->
      <!--date and datetime options-->
      <!--div v-else-if="(cw.timing.start.type == 'date' || cw.timing.start.type == 'datetime')"
           class="mt-4 flex flex-wrap gap-3">
        <div class="flex align-items-center">
          Starting at
        </div>
        <div v-if="cw.timing.start.type=='date'" class="flex align-items-center">
          00:00:00 of
        </div>
        <Dropdown v-model="startSpecifiedDt"
                  :options="startSpecifiedDts"
                  optionLabel="label"
                  class="flex align-items-center"
                  @change="cw.timing.start.label = startLabel"/>
        <div v-if="startSpecifiedDt && startSpecifiedDt.duster_field_name" class="flex align-items-center">
          before&nbsp;
          <Dropdown v-model="cw.timing.start.rp_date"
                    :options="rpDates"
                    optionLabel="label"
                    optionValue="redcap_field_name"/>
        </div>
      </div-->

    </Panel>

    <Panel header="End Collection" class="mt-4">
      <div class="flex flex-wrap gap-3 mt-4">
        <TimingEvent
            :time-type-options="TIME_TYPE_OPTIONS"
            v-model:timing-object="cw.timing.end"
            event-type="end"
            :event-options="eventOptions"
            :rp-dates="rpDates"
            :start-timing-object="cw.timing.start"
            @clear-preset="clearPreset"
        />
        <!--div v-for="type in END_TIME_TYPE_OPTIONS" :key="type.value" class="flex align-items-center">
          <RadioButton v-model="cw.timing.end.type"
                       :inputId="type.value"
                       name="endTimeType"
                       :value="type.value"
                       :id="'end_' + type.value"
                       :disabled="type.value ==='interval' && cw.timing.start.type=='interval'"
                       @change="cw.timing.end.label = endLabel"
          />
          <label :for="'end_' + type.value" class="ml-2">{{ type.text }}</label>
        </div>
      </div>
      <div v-if="cw.timing.end.type=='interval'" class="card">

        <div class="flex flex-wrap gap-3 mt-4">
          <div class="flex align-items-center">
            Ending at&nbsp;<span class="p-float-label">
            <InputNumber v-model="cw.timing.end.interval.length" id="endIntervalLength" inputId="integeronly"
                         @change="cw.timing.end.label = endLabel"/>
          <label for="endIntervalLength">Length of Interval</label>
          </span>
          </div>
          <div v-for="type in INTERVAL_OPTIONS" :key="type.value" class="flex align-items-center">
            <RadioButton v-model="cw.timing.end.interval.type"
                         :inputId="type.value"
                         name="endInterval"
                         :value="type.value"
                         @change="cw.timing.end.label = endLabel"
            />
            <label :for="type.value" class="ml-2">{{ type.text }}</label>
          </div>
          <div class="flex align-items-center">
            after {{ startLabel }}
          </div>
        </div>
      </div>
      <div v-else-if="(cw.timing.end.type == 'date' || cw.timing.end.type == 'datetime')"
           class="mt-4 flex flex-wrap gap-3">
        <div class="flex align-items-center">
          Ending at
        </div>
        <div v-if="cw.timing.end.type=='date'" class="flex align-items-center">
          23:59:00 of
        </div>
        <Dropdown v-model="endSpecifiedDt"
                  :options="endSpecifiedDts"
                  optionLabel="label"
                  @change="cw.timing.end.label = endLabel"/>
        <div v-if="endSpecifiedDt && endSpecifiedDt.duster_field_name">
          after&nbsp;
          <Dropdown v-model="cw.timing.end.rp_date"
                    :options="rpDates"
                    optionLabel="label"
                    optionValue="redcap_field_name"/>
        </div-->
      </div>

    </Panel>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancelTiming"/>
      <Button label="Save" icon="pi pi-check" text @click="saveTiming"/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type {PropType} from "vue";
import type CollectionWindow from "@/types/CollectionWindow";
import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type TimingConfig from "@/types/TimingConfig";
import type {TIMING_TYPE} from "@/types/TimingConfig";
import {START_TIME_TYPE_OPTIONS, END_TIME_TYPE_OPTIONS, TIME_TYPE_OPTIONS, INTERVAL_OPTIONS} from
      "@/types/TimingConfig";
import {computed, watch, ref} from "vue";
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import TimingEvent from "./TimingEvent.vue"

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
    ['update:showTimingDialog', 'update:collectionWindow', 'saveTimingUpdate', 'cancelTimingUpdate']
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

const selectedPreset = ref<CollectionWindow>()
// add a watch to selectedPresets
watch(selectedPreset, (preset: any) => {
  if (preset && cw.value && cw.value.timing ) {
    cw.value.timing.start = JSON.parse(JSON.stringify(preset.timing.start))
    cw.value.timing.end = JSON.parse(JSON.stringify(preset.timing.end))
    cw.value.label = preset.label
    if (cw.value.timing.start && cw.value.timing.start.rp_date == "")
      cw.value.timing.start.rp_date = props.rpDates[0].redcap_field_name
    if (cw.value.timing.end && cw.value.timing.end.rp_date == "")
      cw.value.timing.end.rp_date = props.rpDates[0].redcap_field_name
  }
})

const saveTiming = () => {
  visible.value = false
  emit('saveTimingUpdate')
}

const cancelTiming = () => {
  visible.value = false
  emit('cancelTimingUpdate')
}

const clearPreset = () => {
  selectedPreset.value = undefined
}

/*const getDateText = (options:TimingConfig[], dusterFieldName?:string|null, redcapFieldName?:string|null) => {
  if (dusterFieldName) {
    let option = options.find(opt => opt.duster_field_name === dusterFieldName)
    if (option) return option.label
  } else if (redcapFieldName) {
    let option = options.find(opt => opt.redcap_field_name === redcapFieldName)
    if (option) return option.label
  }
  return ""
}*/

</script>

<style scoped>


</style>
