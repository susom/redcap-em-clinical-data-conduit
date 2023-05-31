<template>
  <div class="container">
    <Panel header="Demographics">
      <div class="mb-2">
        Select demographics below that you'd like to collect on your cohort.
          <br>
          <em>Please bear in mind HIPAA Minimum Necessary when selecting identifying information.</em>
      </div>

      <div class="formgrid grid">

          <div v-for="field in sorted" :key="field.duster_field_name"
               class="my-2 col-6">
            <div>
              <Checkbox v-model="selected"
                        :id="field.duster_field_name"
                        :value="field"
              />
              <label :for="field.duster_field_name" class="ml-2">{{ field.label }}</label></div>

          </div>
      </div>
      <div class="formgrid grid">
        <div class="col-offset-6 col-6">
        <Button
          :label="selectButtonLabel"
          size="small"
          @click="selectAll" />
  <!--Checkbox v-model="selectAll"
                    id="selectAll"
                    :binary="true"
          />
          <label for="selectAll" class="ml-2">Select All</label-->
        </div>
      </div>
    </Panel>
  </div>
</template>


<script setup lang="ts">
import {ref, computed, watch} from "vue"
import type {PropType} from 'vue'
import type FieldMetadata from "@/types/FieldMetadata"

const props = defineProps({
  demographicsOptions: {
    type: Array as PropType<Array<FieldMetadata>>,
    required: true
  },
  demographicsSelects: {
    type:  Array as PropType<Array<FieldMetadata>>,
    required: true
  }
})
const emit = defineEmits(['update:demographicsSelects'])

const selected = computed({
  get() {
    return props.demographicsSelects
  },
  set(value) {
    emit('update:demographicsSelects', value)
  }
})

const sorted = computed(()=>{
  if (props.demographicsOptions) {
    let toSort:any[] = JSON.parse(JSON.stringify(props.demographicsOptions))
    // sort name and date options together
    toSort.forEach(option => {
      if (option.label.toLowerCase().indexOf("date") > -1) {
        option['group'] = 1
      } else if (option.label.toLowerCase().indexOf("name") > -1) {
        option['group'] = 2
      } else {
        option['group'] = 3
      }
    })

    // sort group, then alphabetically by label
    toSort.sort(function (a: any, b: any) {
      let x = a.label.toLowerCase()
      let y = b.label.toLowerCase()
      if (a.group < b.group) return -1
      if (a.group > b.group) return 1
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });
    return toSort
  }
  return props.demographicsOptions
});

const selectButtonLabel = computed(()=> {
    return (selected.value.length < props.demographicsOptions.length)
        ? "Select All"
        : "Unselect All"
})

const selectAll = () => {
  // selectButtonLabel is computed after this invoked so can't use it here.
  selected.value.length = 0
  if (selected.value.length < props.demographicsOptions.length) {
    selected.value = [...sorted.value]
  }

}

/*const selectAll = ref<Boolean>(false)
watch(selectAll, (newSelectAll: any) => {
  if (selected.value) {
    if (newSelectAll) {
        selected.value.length = 0
        if (sorted.value) {
          selected.value = [...sorted.value]
      }
    } else {
      selected.value.length = 0
    }
  }
})*/



</script>

<style scoped>

</style>
