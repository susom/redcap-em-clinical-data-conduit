<template>

  <div class="grid">
    <div v-for="(col, index) in filtered" :key="index" class="col mr-3">
        <div class="flex justify-content-between flex-wrap">
          <div class="mb-2"><strong>Selections</strong></div>
          <div v-if="hasAggregates" class="mb-2 mr-3"><strong>Aggregates</strong></div>
        </div>
      <div v-for="field in col" :key="field.duster_field_name"
           :style="(field.visible) ? '' : hide"
           class="my-2 flex justify-content-between flex-wrap">
        <div>
          <Checkbox v-model="selected"
                    :name="category"
                    :id="field.duster_field_name"
                    :value="field"
          />
          <label :for="field.duster_field_name" class="ml-2">{{ field.label }}</label>
        </div>
        <div v-if="hasAggregates" class="mr-3">            
          <span v-if="field.selected" class="text-sm">
            <span v-if="!field.aggregate_type || field.aggregate_type === 'default'">default aggregates</span>
            <Chip v-else v-for="aggr in field.aggregates" :label="aggr.text" :key="aggr.text" class="text-sm pt-0 pb-0 mr-1" style="height:1.5em"/>
            <!--{{ getAggregatesLabel(field.aggregate_type, field.aggregates) }}-->
          </span>
          <Button icon="pi pi-cog" outlined text class="ml-2" 
                style="height:1.3em"
                v-if="field.selected"
                @click="showAggregatesDialog(field)" v-tooltip.top="'Edit Aggregates'"/>
          <!--
          <Button icon="pi pi-pencil" rounded class="ml-2"
                  :disabled="!field.selected"  
                  v-if="field.selected"                
                  @click="showAggregatesDialog(field)"/>
            -->
        </div>
      </div>
    </div>
  </div>
  <Dialog :visible="aggregatesDialogVisible" header="Aggregates">
    <div class="flex flex-wrap gap-3 my-3">
      <div class="flex align-items-center">
        <RadioButton v-model="currentField.aggregate_type"
                     inputId="defaultAggregates"
                     id="defaultAggregates"
                     name="defaultCustom"
                     value="default"
                     autofocus
                     @change="customAggregatesVisible=false"
        />
        <label for="defaultAggregates" class="ml-2">Default Aggregates</label>
      </div>
      <div class="flex align-items-center">
        <RadioButton v-model="currentField.aggregate_type"
                     inputId="customAggregates"
                     id="customAggregates"
                     name="defaultCustom"
                     value="custom"
                     @change="customAggregatesVisible=true"
        />

        <label for="customAggregates" class="ml-2">Custom Aggregates</label>
      </div>
    </div>
    <div v-if="currentField.aggregate_type=='custom'" class="mb-3">
      <div class="flex flex-wrap gap-3">
      <div v-for="aggOption in AGGREGATE_OPTIONS" :key="aggOption.value"
           class="flex align-items-center">
        <div v-if="aggOption.value!='closest_time' || (aggOption.value=='closest_time' && hasClosestTime)"
          class="mb-3 mt-2">
          <Checkbox v-model="currentField.aggregates"
                    name="aggregateOptions"
                    :id="aggOption.value"
                    :value="aggOption"
                    :class="{ 'p-invalid': aggOptionErrorMessage }"
                    @click="aggOptionErrorMessage=false"
          />
          <label :for="aggOption.value" class="ml-2">{{ aggOption.text }}</label>
        </div>
        </div>
      </div>
      <small
          v-if="aggOptionErrorMessage"
          id="aggOption-help"
          class="flex p-error mb-3">
        {{ aggOptionErrorMessage }}
      </small>
    </div>
    <template #footer>
      <Button label="Close" icon="pi pi-times" @click="cancelAggregates" text/>
      <!--Button label="Save" icon="pi pi-check" @click="aggregatesDialogVisible = false" autofocus/-->

      <Button label="Save" icon="pi pi-check" @click="updateAggregates" autofocus/>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import type {PropType} from "vue";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import type FieldMetadata from "@/types/FieldMetadata";

const hide = ref<string>("display:none !important")
const props = defineProps({
  selectedOptions: {
    type: Object as PropType<Array<FieldMetadata>>,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  numColumns: Number,
  hasAggregates: {
    type: Boolean,
    required: true
  },
  hasClosestTime: {
    type: Boolean,
    required: true
  },
  searchText: {
    type: String,
    default: null,
    required: true
  },
  selectFilter: {
    type: String,
    required: true
  },
  options: {
    type: Object as PropType<Array<FieldMetadata>>,
    required: true
  }
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

// sorts the metadata by label and divides into 2 columns
const sorted = computed<FieldMetadata[][]>(() => {
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
    let cols = 2
    if (props.numColumns)
      cols = props.numColumns
    let numRows = Math.ceil(toSort.length / cols)
    let retArray = []
    for (let i = 0; i < cols - 1; i++) {
      retArray.push(toSort.splice(0, numRows))
    }
    retArray.push(toSort)
    return retArray
  }
  return []
});

// returns true if option should be visible based on search input
const filterBySearch = (option: FieldMetadata) => {
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
const filterBySelect = (option: FieldMetadata) => {
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
const filtered = computed<FieldMetadata[][]>(() => {
  let filtered: FieldMetadata[][] = sorted.value
  filtered.forEach(column => {
    column.forEach(option => {
      option.visible = filterBySearch(option) && filterBySelect(option)
    })
  })
  return filtered
})

const aggregatesDialogVisible = ref(false)
const customAggregatesVisible = ref(false)

const getAggregatesLabel = (aggregateType?: string, aggregates?: any[]) => {
  if (!aggregateType || aggregateType === 'default') {    
    return 'default aggregates'
  } else {
    if (aggregates) {
      let aggLabels: string[] = []
      aggregates.forEach(aggregate => aggLabels.push(aggregate.text))
      return '[' + aggLabels.join(', ') + ']'
    }
    return "[]"
  }
}

//save the state of the aggregates for cancel aggregates implementation
const savedAggregateType = ref()
const savedCustomAggregates = ref<any[]>([])

const showAggregatesDialog = (field:any) => {
  currentField.value = field
  // save the current state in case of cancel
  savedAggregateType.value = currentField.value.aggregate_type
  savedCustomAggregates.value = [...currentField.value.aggregates]
  aggregatesDialogVisible.value = true

}

const aggOptionErrorMessage = ref<any>()

const updateAggregates = () => {
  // first make sure custom aggregates have been selected if aggregate_type is custom
  if (currentField.value.aggregate_type === 'custom' && !currentField.value.aggregates.length) {
    aggOptionErrorMessage.value = "At least one custom aggregation must be selected."
  } else {
    aggregatesDialogVisible.value = false
    if (currentField.value.aggregate_type === 'default') {
      currentField.value.aggregates.length = 0
    }
    // update in the selected options
    if (selected.value) {
      let selectedIndex = getOptionIndex(currentField.value.duster_field_name, selected.value)
      if (selectedIndex > -1 && selected.value[selectedIndex]) {
        selected.value[selectedIndex] = JSON.parse(JSON.stringify(currentField.value))
      }
    }
  }
}

const cancelAggregates = () => {
  aggregatesDialogVisible.value = false
  // restore original saved state
  currentField.value.aggregate_type = savedAggregateType.value
  currentField.value.aggregates = savedCustomAggregates.value
  if (filtered.value) {
    let index = getOptionIndex(currentField.value.duster_field_name, filtered.value)
    if (index > -1 && filtered.value[index]) {
      filtered.value[index] = JSON.parse(JSON.stringify(currentField.value))
    }
  }
}

const getOptionIndex = (dusterFieldName: string, haystack: any) => {
  //console.log(id)
  return haystack.findIndex(
      (cw:any) => cw.duster_field_name === dusterFieldName)
}

</script>

<style scoped>

</style>
