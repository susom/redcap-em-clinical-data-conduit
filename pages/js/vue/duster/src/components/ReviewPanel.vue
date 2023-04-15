<template>
  <Panel header="Review Settings">
  <Panel header="Researcher Provided Data">
    <DataTable :value="rpIdentifiers"  tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-sm text-900 font-bold">Identifiers</span>
        </div>
      </template>
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="redcap_field_type" header="REDCap Field Type"></Column>
    </DataTable>

    <DataTable :value="rpDates"  tableStyle="min-width: 50rem mt-2">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-sm text-900 font-bold">Timing</span>
        </div>
      </template>
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="type" header="Field Type"></Column>
    </DataTable>
  </Panel>

  <Panel v-if="demographicsConfigs.length > 0" header="Demographics" class="mt-2">
    <DataTable :value="demographicsConfigs"  tableStyle="min-width: 50rem">
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="redcap_field_type" header="REDCap Field Type"></Column>
    </DataTable>
  </Panel>

  <Panel v-for="cw in cwConfigs" :key="cw.form_name" :header="cw.label" class="mt-2">
    <DataTable :value="getTimingCols(cw.timing, cw.event)"  class="mt-2"
               tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-0 text-900 font-bold">Timing</span>
        </div>
      </template>
      <Column field="event" header="Date"></Column>
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="redcap_field_type" header="REDCap Field Type"></Column>
    </DataTable>

    <DataTable v-if="cw.timing.repeat_interval"
               :value="getRepeatCols(cw.timing)"  class="mt-2"
               tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-0 text-900 font-bold">Repeating Interval</span>
        </div>
      </template>
      <Column field="type" header="Type"></Column>
      <Column field="length" header="Length"></Column>
    </DataTable>

    <DataTable :value="cw.data.labs" class="mt-2"
               tableStyle="min-width: 50rem"
                v-if="cw.data.labs.length > 0"
    >
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-0 text-900 font-bold">Labs</span>
        </div>
      </template>
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="redcap_field_note" header="REDCap Field Note"></Column>
    </DataTable>

    <DataTable :value="cw.data.vitals" class="mt-2"
               tableStyle="min-width: 50rem"
               v-if="cw.data.vitals.length > 0">
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
        <span class="text-0 text-900 font-bold">Vitals</span>
      </div>
    </template>
    <Column field="label" header="Label"></Column>
    <Column field="redcap_field_name" header="REDCap Field Name"></Column>
    <Column field="redcap_field_note" header="REDCap Field Note"></Column>
  </DataTable>

    <DataTable :value="cw.data.outcomes" class="mt-2"
               tableStyle="min-width: 50rem"
               v-if="cw.data.outcomes.length > 0">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-0 text-900 font-bold">Outcomes</span>
        </div>
      </template>
      <Column field="label" header="Label"></Column>
      <Column field="redcap_field_name" header="REDCap Field Name"></Column>
      <Column field="redcap_field_type" header="REDCap Field Type"></Column>
      <Column field="redcap_options" header="REDCap Options"></Column>
    </DataTable>

    <!-- single table version of outcomes -->
    <ScoreSummaryTable
        v-if="cw.data.scores.length > 0"
        v-model:scores="cw.data.scores"
      class="mt-2"
    />

<!-- separate tables for each score -->
    <!--this version uses row grouping w/ Jonasel's score fields-->

<div v-for="(score,index) in cw.data.scores" :key="score.duster_field_name">
  {{cw.data.scores[index].label}}
  <ScoreSummaryTablePerScore
    :score="getScoreFields(score)"
    :score-label="cw.data.scores[index].label"
    class="mt-2"
  />
</div>
  </Panel>
    <Toolbar>
      <template #start>
        <Button label="Back" icon="pi pi-angle-left"  @click="show=false"/>
      </template>
      <template #end>
      <Button label="Create Project" icon="pi pi-check" severity="success" @click="createProject"/>
      </template>
    </Toolbar>
  </Panel>
  <Dialog v-model:visible="showDusterConfig" modal :style="{ width: '50vw' }">
    <Panel header="Config to starr-api">
    <pre>{{JSON.stringify(dusterConfig, null, 4)}}</pre>
    </Panel>
    <Button label="Close" icon="pi pi-times"  @click="showDusterConfig=false"/>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {PropType} from "vue";
import type CollectionWindow from "@/types/CollectionWindow";
import {INIT_TIMING_CONFIG} from "@/types/TimingConfig";
import type TimingConfig from "@/types/TimingConfig";
import type FieldMetadata from "@/types/FieldMetadata";
import type FieldConfig from "@/types/FieldConfig";
import type TextValuePair from "@/types/TextValuePair";
import type Subscore from "@/types/Subscore";
import type SubscoreDependency from "@/types/SubscoreDependency";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import ScoreSummaryTable from "@/components/ScoreSummaryTable.vue";
import ScoreSummaryTablePerScore from "@/components/ScoreSummaryTablePerScore.vue";


const props = defineProps({
  showSummary: Boolean,
  rpIdentifiers: {
    type: Array as PropType<Array<FieldConfig>>,
    required: true
  },
  rpDates: {
    type: Array as PropType<Array<FieldConfig>>,
    required: true
  },
  demographics: {
    type: Array as PropType<Array<FieldMetadata>>
  },
  collectionWindows: {
    type: Array as PropType<Array<CollectionWindow>>
  }
})

const emit = defineEmits(['update:showSummary'])

const show = computed<boolean>({
  get(){
  return props.showSummary
  },
  set(value){
    emit("update:showSummary", value)
  }
})

const rpDataConfigs = computed<any> (()=>{
  const rpInfo:any = {rp_identifiers:{}, rp_dates:{}}
  rpInfo['rp_identifiers'] = JSON.parse(JSON.stringify(props.rpIdentifiers))
  for (let rpdate of props.rpDates) {
    if (rpdate.redcap_field_name) {
      rpInfo.rp_dates[rpdate.redcap_field_name] = {
        label: rpdate.label,
        redcap_field_name: rpdate.redcap_field_name,
        redcap_field_type: rpdate.redcap_field_type,
        value_type: rpdate.value_type,
        phi: rpdate.phi}
    }
  }
      return rpInfo
})

const demographicsConfigs = computed<FieldConfig[]>(()=>{
  const demographics: FieldConfig[] = []
  if (props.demographics) {
    props.demographics.forEach(demo => demographics.push({
      duster_field_name: demo.duster_field_name,
      redcap_field_name: demo.duster_field_name,
      redcap_field_type: demo.redcap_field_type,
      label: demo.label,
      value_type: demo.value_type,
      phi: demo.phi})
    )
  }
  return demographics
})

const cwConfigs = computed<CollectionWindow[]>(()=>{
  const configs: CollectionWindow[] = []
  if (props.collectionWindows) {
    props.collectionWindows.forEach((cw, index) => {
      let config: any = {
        type: "nonrepeating",
        label: cw.label,
        form_name: getFormName(cw.label),
        timing: getTiming(cw.timing, index),
        event: (cw.event) ? getEvent(cw.event, index) : undefined
      }
      config.data = getData(cw.data, index, cw.aggregate_defaults, config.event, cw.closest_time)
      configs.push(config)
    })
  }
  return configs
})


const formNamesArr = ref<string[]>(['researcher_provided_information', 'demographics'])

const getFormName=(label:string)=> {
    // remove whitespace at start and end and convert to lowercase characters only
    let formName = label.trim().toLowerCase()
            .replace(/ /g, '_') // replace spaces with underscore
            .replace(/[^a-z_0-9]/g, ''); // remove illegal characters

    // remove any double underscores
    while(formName.indexOf('__') != -1) {
      formName = formName.replace(/__/g, '_');
    }
    // remove beginning underscores
    while(formName.substring(0, 1) == '_') {
      formName = formName.substring(1);
    }
    // remove ending underscores
    while(formName.substring(formName.length - 1) == '_') {
      formName = formName.substring(0, formName.length - 1);
    }
    // if there is a leading number then append a prefix
    if (!isNaN(parseInt(formName.charAt(0)))) {
        formName = "fm_" + formName;
      }
    // remove beginning numerals
    /*while(/^\d$/g.test(formName.substring(0, 1))) {
      formName = formName.substring(1);
    }
    // remove beginning underscores again
    while(formName.substring(0, 1) == '_') {
      formName = formName.substring(1);
    }

    // ensure formName doesn't begin with a number and formName cannot be blank
    if(/^\d$/.test(formName.substring(0, 1)) || formName == '') {
      let md5 = require('md5');
      formName = md5(formName).replaceAll(/[0-9]/g, '').substring(0, 4) + formName;
    }*/

    // if longer than 50 characters, substring formName to 50 characters
    formName = formName.substring(0, 50);

    // ensure formName doesn't already exist
  if (formNamesArr.value.findIndex(fn => fn == formName) > -1) {
      // substring formName to less than 50 characters in length
      formName = formName.substring(0, 44);
      // append random values to formName to prevent duplication
      formName = formName + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString().substring(0, 6);
      // formName = formName + CryptoJS.SHA1(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).substring(0, 6);
    }
  formNamesArr.value.push(formName)
  return formName;
}

// for display in table
const getTimingCols = (timingObj:any, events:any) => {
  let cols = []
  cols.push({
    event: "Start",
    label: timingObj.start.label,
    redcap_field_name: timingObj.start.redcap_field_name,
    redcap_field_type: timingObj.start.redcap_field_type
  })
  cols.push({
    event: "End",
    label: timingObj.end.label,
    redcap_field_name: timingObj.end.redcap_field_name,
    redcap_field_type: timingObj.end.redcap_field_type
  })
  if (events) {
    events.forEach(event => {
      cols.push({
        event: "Closest to Event",
        label: event.label,
        redcap_field_name: event.redcap_field_name,
        redcap_field_type: event.redcap_field_type
      })
    })
  }
  return cols
}

const getRepeatCols=(timingObj:any)=> {
  if (timingObj.repeat_interval)
  return [timingObj.repeat_interval]
}

const getTiming=(timing:any, index:number) => {
  let tconfig: any = {
    start: getTimingConfig(timing.start, index, 'start'),
    end: getTimingConfig(timing.end, index, 'end')
  }
  if (timing.repeat_interval && timing.repeat_interval.type) {
    tconfig.repeat_interval = {...timing.repeat_interval}
  }
  return tconfig
}

const getEvent = (events:TimingConfig[], index:number) => {
  let eventArr:any[] = []
  if (events) {
    events.forEach((evt, eventIndex) => {
        if (evt.type) {
        eventArr.push(getTimingConfig(evt, index, 'closest_event' + eventIndex))
        }
    })
  }
  if (eventArr.length > 0)
    return eventArr
  return null
}

const getTimingConfig = (timing:TimingConfig, index: number, eventType:string) =>{
  let tconfig: any = {
    type: timing.type,
    label: timing.label
  }

  if (timing.type == 'interval' && timing.interval) {
    tconfig.interval={}
    tconfig.interval.type = timing.interval.type
    tconfig.interval.length = timing.interval.length
  } else {
    tconfig.type = timing.type
    tconfig.redcap_field_name = 'cw' + index + "_" + eventType + "_dttm"
    tconfig.redcap_field_type = timing.redcap_field_type
    tconfig.value_type= timing.value_type
    tconfig.rp_date = timing.rp_date
    tconfig.phi= "t"
    if (timing.duster_field_name) {
      tconfig.duster_field_name = timing.duster_field_name
    } else if (timing.redcap_field_name) {
      // get the rp_date label
      let rpIndex = props.rpDates.findIndex(rpDate => rpDate.redcap_field_name == timing.rp_date)
      tconfig.label = props.rpDates[rpIndex].label
      tconfig.duster_field_name = null
    }
  }
  return tconfig
}

const getData = (data:any, index:number, aggDefaults?: TextValuePair[], event?:TimingConfig[], closestTime?:string) => {
  let dconfig:any = {}
  dconfig.labs = getConfigWithAggregates(data.labs, index, aggDefaults, event, closestTime)
  dconfig.vitals = getConfigWithAggregates(data.vitals, index, aggDefaults, event, closestTime)
  dconfig.outcomes = getConfigNoAggregates(data.outcomes, index)
  dconfig.scores = getScoresConfig(data.scores, index)
  return dconfig
}

const getConfigWithAggregates = (data:FieldMetadata[], index:number, aggDefaults?: TextValuePair[],
  event?:TimingConfig[], closestTime?:string) =>{
  let configArray:FieldConfig[] = []
  let evt = (event && event[0]) ? event[0] : INIT_TIMING_CONFIG
  for (let fieldMetadata of data) {
    let aggregates:TextValuePair[] = (fieldMetadata.aggregates && fieldMetadata.aggregates.length > 0)
        ? fieldMetadata.aggregates:
        (aggDefaults) ? aggDefaults: []
    for (let agg of aggregates) {
      let aggName = agg['value'].replace('_agg','')
      let config:any ={
        label: getAggregateLabel(fieldMetadata.label, agg.value, evt, closestTime),
        duster_field_name: fieldMetadata.duster_field_name,
        redcap_field_name: fieldMetadata.duster_field_name + "_" + aggName + "_" + index,
        value_type: fieldMetadata.value_type,
        redcap_field_type: fieldMetadata.redcap_field_type,
        redcap_options: fieldMetadata.redcap_options,
        redcap_field_note: fieldMetadata.redcap_field_note,
        aggregate: agg.value
      }
      if (agg.value == 'closest_event' && evt) {
          config.aggregate_options = {}
          config.aggregate_options.event =evt.redcap_field_name
        }

      if (agg.value == 'closest_time') {
        config.aggregate_options = {}
        config.aggregate_options.time = closestTime
        }

      configArray.push(config)
    }
  }
  return configArray
}

const getConfigNoAggregates = (data:FieldMetadata[], index:number) =>{
  let configArray:FieldConfig[] = []
  for (let fieldMetadata of data) {
      configArray.push({
        label: fieldMetadata.label,
        duster_field_name: fieldMetadata.duster_field_name,
        redcap_field_name: fieldMetadata.duster_field_name + "_" + index,
        value_type: fieldMetadata.value_type,
        redcap_field_type: fieldMetadata.redcap_field_type,
        redcap_options: fieldMetadata.redcap_options,
        redcap_field_note: fieldMetadata.redcap_field_note
      })
    }
  return configArray
}

const getAggregateLabel = (varLabel:string, aggregate: string, event?:TimingConfig, closestTime?: string) => {
  let aggLabelIndex = AGGREGATE_OPTIONS.findIndex(option => option.value == aggregate)
  let aggLabel = AGGREGATE_OPTIONS[aggLabelIndex].text

  if (aggregate == 'closest_event' && event) {
    return varLabel + " " + aggLabel
    /*
add the event label to closest to event label
works but label is long and messy
  let rpIndex = props.rpDates.findIndex(rpDate => rpDate.redcap_field_name ==
      event.rp_date)
  label += " " + props.rpDates[rpIndex].label
*/
  }
  if (aggregate == 'closest_time') {
    return varLabel + " " + aggLabel + " " + closestTime
  }
  return aggLabel + " " + varLabel
}

const getScoreFields = (score:any) => {
  let fieldsArr = [];
  if (score.subscores) {
    score.subscores.forEach((subscore:any) => {
      if (subscore.dependencies) {
        subscore.dependencies.forEach((clinicalVar:SubscoreDependency) => {
          fieldsArr.push({
            label: clinicalVar.label,
            redcap_field_name: clinicalVar.redcap_field_name,
            category: subscore.label
          });
        });
      }
      fieldsArr.push({
        label: subscore.label,
        redcap_field_name: subscore.redcap_field_name,
        category: subscore.label
      });
    });
    fieldsArr.push({
      label: score.label,
      redcap_field_name: score.redcap_field_name,
      category: score.label,
    });
  }
  return fieldsArr;
}

const getScoresConfig = (scoresMeta:FieldMetadata[], index:number) => {
  const scoresArr:any = [];
  scoresMeta.forEach((score) => {
    const subscoresArr:Subscore[] = [];
    let scoreCalculation = score.redcap_options;
    if (score.subscores) {
      score.subscores.forEach((subscore) => {

        const clinicalVarArr: any = [];
        let subscoreCalculation = subscore.redcap_options;
        if (subscore.dependencies) {
          subscore.dependencies.forEach((clinicalVar) => {
          if (clinicalVar.aggregates) {
            clinicalVar.aggregates.forEach((agg) => {
              let clinicalVarRCFieldName = subscore.duster_field_name + '_'
                  + clinicalVar.duster_field_name + '_'
                  + agg.replace("_agg", "_")
                  + index;
              let regExp = new RegExp('\\[' +
                  clinicalVar.duster_field_name + '_'
                  + agg.replace("_agg", "") + '\\]','g');  // regex pattern string
              subscoreCalculation = (subscoreCalculation && subscoreCalculation.length > 0)?
                  subscoreCalculation.replace(regExp,
                  '[' + clinicalVarRCFieldName + ']') :
                  subscoreCalculation;

              clinicalVarArr.push({
                duster_field_name: clinicalVar.duster_field_name,
                redcap_field_name: clinicalVarRCFieldName,
                // will need to change this in the future, for now assume subscores not dependent on closest time
                label: getAggregateLabel(agg, undefined, undefined) + " " + clinicalVar.label,
                redcap_field_type: clinicalVar.redcap_field_type,
                redcap_options: clinicalVar.redcap_options,
                value_type: clinicalVar.value_type,
                redcap_field_note: clinicalVar.redcap_field_note,
                aggregate: agg
              });
            });
          } else {
            let clinicalVarRCFieldName = subscore.duster_field_name + '_'
                + clinicalVar.duster_field_name + '_'
                + index;
            let regExp = new RegExp('\\[' + clinicalVar.duster_field_name + '\\]','g');
            subscoreCalculation = (subscoreCalculation && subscoreCalculation.length > 0) ?
                subscoreCalculation.replace(regExp, '[' +
            clinicalVarRCFieldName + ']'): subscoreCalculation;
            clinicalVarArr.push({
              duster_field_name: clinicalVar.duster_field_name,
              redcap_field_name: clinicalVarRCFieldName,
              label: clinicalVar.label,
              redcap_field_type: clinicalVar.redcap_field_type,
              redcap_options: clinicalVar.redcap_options,
              value_type: clinicalVar.value_type,
              redcap_field_note: clinicalVar.redcap_field_note
            });
          }
        });
      }
        let subscoreRCFieldName = subscore.duster_field_name + '_' + index;
        let regExp = new RegExp('\\[' + subscore.duster_field_name + '\\]','g');
        scoreCalculation = (scoreCalculation && scoreCalculation.length > 0) ?
            scoreCalculation.replace(regExp, '[' + subscoreRCFieldName + ']'):
            scoreCalculation;
        subscoresArr.push({
          duster_field_name: subscore.duster_field_name,
          redcap_field_name: subscore.duster_field_name + '_' + index,
          score_duster_field_name: score.duster_field_name,
          label: subscore.label,
          redcap_field_type: subscore.redcap_field_type,
          redcap_field_note: subscore.redcap_field_note,
          redcap_options: subscoreCalculation,
          value_type: subscore.value_type,
          dependencies: clinicalVarArr
        });
      });
    }

    scoresArr.push({
      duster_field_name: score.duster_field_name,
      redcap_field_name: score.duster_field_name + '_' + index,
      label: score.label,
      redcap_field_type: score.redcap_field_type,
      redcap_field_note: score.redcap_field_note,
      redcap_options: scoreCalculation,
      value_type: score.value_type,
      subscores: subscoresArr
    });
  });
  return scoresArr
}

const dusterConfig = ref<any>()
const showDusterConfig = ref<boolean>(false)
const createProject = () => {
  dusterConfig.value = {
    rpInfo: rpDataConfigs,
    demographics: demographicsConfigs,
    collection_windows: cwConfigs,
  }
  showDusterConfig.value = true
}

</script>

<style scoped>
:deep(.p-panel .p-panel-header) {
  background: #aeb6bf;
}
:deep(.p-datatable .p-datatable-header) {
  background: #ced4da;
}

</style>
