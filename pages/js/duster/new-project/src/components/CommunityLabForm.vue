<script setup lang="ts">
  import {ref} from "vue";
  import InputGroup from "primevue/inputgroup";

  const emit = defineEmits(['closeForm']);

  const valueTypes = ["Number", "Text"];
  const selectedValueType = ref();

  const componentIds = ref<number[]>([]);
  const newCid = ref();

  const loincCodes = ref<number[]>([]);
  const newLoinc = ref();

  const addComponentId = () => {
    // TODO add validation (no duplicates, exists in STARR, etc.)
    if (newCid.value && Number.isInteger(newCid.value)) {
      componentIds.value.push(newCid.value);
      newCid.value = null;
    }
  }

  const addLoincCode = () => {
    // TODO add validation (no duplicates, exists in STARR, etc.)
    if (newLoinc.value && Number.isInteger(newLoinc.value)) {
      loincCodes.value.push(newLoinc.value);
      newLoinc.value = null;
    }
  }

</script>

<template>
  <Dialog
    modal
    header="Create New Community Lab"
    :closable="false"
  >
    <div>
      <label for="name" class="font-bold block mb-2">Name</label>
      <InputText
          id="name"
          autocomplete="off"
      />
    </div>

    <div>
      <label for="value-type" class="font-bold block mb-2">Value type</label>
      <Dropdown
          id="value-type"
          v-model="selectedValueType"
          :options="valueTypes"
          placeholder="Select a value type"
      />
    </div>

    <div>
      <label for="unit" class="font-bold block mb-2">Unit of measurement</label>
      <InputText
          id="unit"
          autocomplete="off"
      />
    </div>

    <div>
      <label for="description" class="font-bold block mb-2">Description</label>
      <Textarea
          id="description"
      />
    </div>


    <!-- TODO component IDs -->
    <div>
      <label for="cid-group" class="font-bold block mb-2">Component IDs</label>
      <InputGroup
        id="cid-group"
        v-for="(cid, i) in componentIds"
        :key="cid"
      >
        <InputNumber
          v-model="componentIds[i]"
          autocomplete="off"
          inputId="integeronly"
          :useGrouping="false"
          :min="0"
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          @click="componentIds.splice(i, 1)"
        />

      </InputGroup>
    </div>
    <label for="cid-input" class="font-bold block mb-2">Add component ID</label>
    <InputGroup>
      <InputNumber
          id="cid-input"
          v-model="newCid"
          inputId="integeronly"
          :min="0"
        />
      <Button
          icon="pi pi-plus"
          severity="success"
          @click="addComponentId()"
      >
      </Button>
    </InputGroup>

    <!-- TODO LOINC codes -->
    <div>
      <label for="loinc-group" class="font-bold block mb-2">LOINC codes</label>
      <InputGroup
          id="loinc-group"
          v-for="(loinc, i) in loincCodes"
          :key="loinc"
      >
        <InputNumber
            v-model="loincCodes[i]"
            autocomplete="off"
            inputId="integeronly"
            :useGrouping="false"
            :min="0"
        />
        <Button
            icon="pi pi-times"
            severity="danger"
            @click="loincCodes.splice(i, 1)"
        />

      </InputGroup>
    </div>
    <label for="loinc-input" class="font-bold block mb-2">Add LOINC code</label>
    <InputGroup>
      <InputNumber
          id="loinc-input"
          v-model="newLoinc"
          inputId="integeronly"
          :min="0"
      />
      <Button
          icon="pi pi-plus"
          severity="success"
          @click="addLoincCode()"
      >
      </Button>
    </InputGroup>


    <template #footer>
      <Button label="Submit" severity="primary" />
      <Button label="Cancel" severity="secondary" @click="$emit('closeForm')" />
    </template>
  </Dialog>
</template>

<style scoped>

</style>