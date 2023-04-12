<template>

  <div class="grid">
    <div v-for="(col, index) in filtered" :key="index" class="col mr-3" style="max-width: 500px">
      <!-- set visibility-->
      <div v-for="field in col" :key="field.duster_field_name"
           :style="(field.visible) ? '' : hide"
           class="my-2 flex justify-content-between flex-wrap">
        <div>
          <Checkbox v-model="selected"
                    :name="category"
                    :id="field.duster_field_name"
                    :value="field"
          />
          <label :for="field.duster_field_name" class="ml-2">{{ field.label }}</label></div>
        <div v-if="hasAggregates">
          <label v-if="field.selected">{{ getAggregatesLabel(field.aggregate_type, field.aggregates) }}</label>
          <Button icon="pi pi-pencil" rounded class="ml-2"
                  :disabled="!field.selected"
                  @click="currentField=field;showAggregatesDialog=true"/>
        </div>

      </div>
    </div>
  </div>
  <Dialog :visible="showAggregatesDialog" header="Aggregates">
    {{ hasClosestTime }}
    <div class="flex flex-wrap gap-3">
      <div class="flex align-items-center">
        <RadioButton v-model="currentField.aggregate_type"
                     inputId="defaultAggregates"
                     id="defaultAggregates"
                     name="defaultCustom"
                     value="default"
                     @change="showCustomAggregates=false"
        />
        <label for="defaultAggregates" class="ml-2">Default Aggregates</label>
      </div>
      <div class="flex align-items-center">
        <RadioButton v-model="currentField.aggregate_type"
                     inputId="customAggregates"
                     id="customAggregates"
                     name="defaultCustom"
                     value="custom"
                     @change="showCustomAggregates=true"
        />
        <label for="customAggregates" class="ml-2">Custom Aggregates</label>
      </div>
    </div>
    <div v-if="currentField.aggregate_type=='custom'" class="flex flex-wrap gap-3">
      <div v-for="aggOption in AGGREGATE_OPTIONS" :key="aggOption.value"
           class="flex align-items-center">
        <div v-if="aggOption.value!='closest_time' || (aggOption.value=='closest_time' && hasClosestTime)">
          <Checkbox v-model="selectedCustomAggregates"
                    name="aggregateOptions"
                    :id="aggOption.value"
                    :value="aggOption"
          />
          <label :for="aggOption.value">{{ aggOption.text }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="showAggregatesDialog = false" text/>
      <Button label="Save" icon="pi pi-check" @click="updateAggregates" autofocus/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {PropType} from "vue";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import type FieldMetadata from "@/types/FieldMetadata";

const hide = ref<string>("display:none !important")
const props = defineProps({
  selectedOptions: Object as PropType<Array<FieldMetadata>>,
  category: String,
  hasAggregates: Boolean,
  hasClosestTime: Boolean,
  searchText: String,
  selectFilter: String,
  options: Object as PropType<Array<FieldMetadata>>
})

const emit = defineEmits(['update:selectedOptions'])

const selected = computed({
  get() {
    return props.selectedOptions
  },
  set(value) {
    emit('update:selectedOptions', value)
  }
})

const currentField = ref<any>()
const selectedCustomAggregates = ref<any[]>([])
const showCustomAggregates = ref(false)

const search = computed<string>(() => {
  if (props.searchText) {
    return props.searchText
  } else return "No Search"
})

// sorts the metadata by label and divides into 2 columns
const sorted = computed<FieldMetadata[][]>(() =>{
    if (props.options) {
      let toSort: any[] = JSON.parse(JSON.stringify(props.options))
      toSort.forEach(option => {
        option.selected = false
        option.aggregate_type = "default"
        option.aggregates = []
      })
      // update saved options
      if (props.selectedOptions) {
        props.selectedOptions.forEach(selected => {
          selected.selected = true
          const index = toSort.findIndex(option => option.duster_field_name === selected.duster_field_name);
          toSort[index].selected = true
          toSort[index].aggregate_type = selected.aggregate_type
          toSort[index].aggregates = JSON.parse(JSON.stringify(selected.aggregates))
        })
      }

      // sort alphabetically by label
      toSort.sort(function (a: any, b: any) {
        let x = a.label.toLowerCase();
        let y = b.label.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      let numRows = Math.ceil(toSort.length / 2)
      let col1 = toSort.splice(0, numRows)
      return [col1, toSort]
    }
    return []
  });

// returns true if option should be visible based on search input
const filterBySearch=(option:FieldMetadata)=> {
  if (props.searchText) {
    if (option.label.toLowerCase().indexOf(props.searchText.toLowerCase()) > -1) {
      return true
    } else {
      return false
    }
  }
  return true
}

// returns true if option should be visible based on selected radio button
const filterBySelect=(option:FieldMetadata)=> {
  if (props.selectFilter) {
    if (props.selectFilter == 'All')
      return true
    else if (props.selectFilter == 'Selected')
      return option.selected
    else
      return !option.selected
  }
  return true
}

// apply search and select filters to sorted columns
const filtered = computed<FieldMetadata[][]>(()=>{
  let filtered:FieldMetadata[][] = sorted.value
  filtered.forEach(column => {
    column.forEach(option =>{
      option.visible = filterBySearch(option) && filterBySelect(option)
    })
  })
  return filtered
})

const showAggregatesDialog = ref(false)

const getAggregatesLabel = (aggregateType: string, aggregates: any[]) => {
  if (!aggregateType || aggregateType === 'default') return 'default'
  else {
    let aggLabels: string[] = []
    aggregates.forEach(aggregate => aggLabels.push(aggregate.text))
    return '[' + aggLabels.join(', ') + ']'
  }
}

const updateAggregates = () => {
  showAggregatesDialog.value = false
  if (currentField.value.aggregate_type === 'custom') {
    currentField.value.aggregates = [...selectedCustomAggregates.value]
    selectedCustomAggregates.value = []
  } else {
    currentField.value.aggregates = []
  }
}

const isSelected = (field: any) => {
  currentField.value = field
  if (selected.value) {
    selected.value.forEach(sel => {
      if (field.duster_field_name == sel.duster_field_name) {
        return true
      }
    })
  }
  return false
}

</script>

<style scoped>

</style>
