<template>
  <div class="grid">
    <div class="col-12">
      {{searchText}}
    <!--InputText placeholder="Search Clinical Value" v-model="filters['global'].value" id="tableSearchOutside"
    /-->
    </div>
    <DataTable class="col"
             v-model:selection="selected"
             v-model:filters="filters"
             filterDisplay="row"
             :globalFilterFields="['label']"
             :value="sorted.col1"
             editMode="row"
               column-resize-mode="fit"
             dataKey="duster_field_name"
             @row-select="onRowSelect($event, 'col1')"
             @row-unselect="onRowUnselect($event, 'col1')"
  >
      <!--template #header>
                        <InputText id="tableSearchInside" v-model="filters['global'].value"
                                   placeholder="Keyword Search" />
      </template-->
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column  key="label" field="label" filterField="label"> {{ field.label }}</Column>
    <Column v-if="hasAggregates" key="aggregate_type" field="aggregate_type">
      <template #body="{ data }">
        {{ getAggregatesLabel(data.aggregate_type, data.aggregates) }}
        <Button  icon="pi pi-pencil" rounded class="ml-2"
                 :disabled="!data.selected"
                 @click="currentField=data;currentTable='col1';showAggregatesDialog=true" />
      </template>
    </Column>
  </DataTable>
    <div v-if="numCols == 2">
  <DataTable v-model:selection="selected"
             :value="sorted.col2"
             dataKey="duster_field_name"
             v-model:filters="filters"
             filterDisplay="row"
             :globalFilterFields="['label']"
             class="col"
             @rowSelect="onRowSelect($event, 'col2')" @rowUnselect="onRowUnselect($event, 'col2')"
              ref="dt">
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column  key="label" field="label" filterField="label"> {{ field.label }}</Column>
    <Column v-if="hasAggregates" key="aggregates" field="aggregates">
      <template #body="{ data }">
        {{ getAggregatesLabel(data.aggregate_type, data.aggregates) }}
        <Button  icon="pi pi-pencil" rounded class="ml-2"
                 :disabled="!data.selected"
                 @click="currentField=data;currentTable='col2';showAggregatesDialog=true" />
      </template>
    </Column>
  </DataTable>
    </div>
  </div>
  <Dialog :visible="showAggregatesDialog" header="Aggregates">
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
                     @change="showCustomAggregates=true;selectedCustomAggregates=currentField.aggregates"
        />
        <label for="customAggregates" class="ml-2">Custom Aggregates</label>
      </div>
    </div>
    <div v-if="currentField.aggregate_type=='custom'" class="flex flex-wrap gap-3">
      <div v-for="aggOption in AGGREGATE_OPTIONS" :key="aggOption.value"
           class="flex align-items-center">
        <Checkbox v-model="currentField.aggregates"
                  name="aggregateOptions"
                  :id="aggOption.value"
                  :value="aggOption"
        />
        <label :for="aggOption.value">{{ aggOption.text }}</label>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="showAggregatesDialog = false" text />
      <Button label="Save" icon="pi pi-check" @click="updateAggregates" autofocus />
    </template>
  </Dialog>
  {{ selected }}
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import type {PropType} from "vue";
import {AGGREGATE_OPTIONS} from "@/types/FieldConfig";
import type FieldMetadata from "@/types/FieldMetadata";
import {FilterMatchMode} from "primevue/api";

const dt = ref()
const props = defineProps({
  selectedOptions: Object as PropType<Array<FieldMetadata>>,
  category: String,
  hasAggregates: Boolean,
  searchFilter: Object,
  searchText: String, // not being used
  options: Object as PropType<Array<FieldMetadata>>,
  columns : Number
})

const emit = defineEmits(['update:selectedOptions','update:searchText', 'update:columns', 'update:searchFilter'])

const selected = computed({
  get() {
    return props.selectedOptions
  },
  set(value) {
    emit('update:selectedOptions', value)
  }
})

const filters = computed({
  get() {
    return props.searchFilter
  },
  set(value) {
    emit('update:searchFilter', value)
  }
})

const numCols = computed({
  get() {
    return props.columns
  },
  set(value) {
    emit('update:columns', value)
  }
})

const search = computed({
  get() {
    return props.searchText
  },
  set(value) {
    emit('update:searchText', value)
  }
})
const testSearchInput = ref<string>("")

const currentField = ref<any>()
const currentTable = ref<string>()
const selectedCustomAggregates = ref<any[]>([])
const showCustomAggregates = ref(false)

// returns sorted options in two columns
const sorted = computed(()=>{
  if (props.options) {
    let toSort:any[] = JSON.parse(JSON.stringify(props.options))
    toSort.forEach(option => {
      option.selected = false
      option.aggregate_type = "default"
      option.aggregates = []
    })

// update saved options
    if(props.selectedOptions) {
      props.selectedOptions.forEach(selected => {
        const index = toSort.findIndex(option => option.duster_field_name ===selected.duster_field_name);
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
    let numRows = toSort.length;
    if (numCols.value == 2)
        numRows = Math.ceil(toSort.length / 2)
    let col1 = toSort.splice(0, numRows)
    return {"col1": col1, "col2": toSort}
  }
  return {"col1":[], "col2":[]}
});

const showAggregatesDialog = ref(false)

const getAggregatesLabel = (aggregateType:string, aggregates:any[]) => {
  if (aggregateType  === 'default') return 'default'
  else {
    let aggLabels:string[] = []
    aggregates.forEach(aggregate => aggLabels.push(aggregate.text))
    return '[' + aggLabels.join(', ') + ']'
  }
}

const updateAggregates = () => {
  showAggregatesDialog.value =false

  //update in selected; no need to update values in table
  if (selected.value) {
    let selectedIndex = getRowIndex(currentField.value.duster_field_name, selected.value)
    selected.value[selectedIndex].aggregate_type = currentField.value.aggregate_type
    selected.value[selectedIndex].aggregates = JSON.parse(JSON.stringify(currentField.value.aggregates))
  }

}

const getRowIndex = (id:string, col:FieldMetadata[]) => {
  console.log(id)
  return col.findIndex(
      (field) => field.duster_field_name === id)
}

const onRowSelect = (event:any, tableId:string) => {
  if (tableId == 'col1') {
    sorted.value.col1[event.index].selected = true
  } else {
    sorted.value.col2[event.index].selected = true
  }
}

const onRowUnselect = (event:any, tableId:string) => {
  if (tableId == 'col1') {
    sorted.value.col1[event.index].selected = false
  } else {
    sorted.value.col2[event.index].selected = false
  }
}

</script>


<style scoped>
</style>
