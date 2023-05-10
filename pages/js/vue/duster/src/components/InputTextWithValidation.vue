<template>
  <!-- not updating v-model
  <div class="field">
    <label v-if="label" :for="`${name}`">{{ label }}</label>
    <InputText
        v-model="value"
        :id="`${name}`"
        :aria-describedby="`${name}-help`"
        :class="{ 'p-invalid': errorMessage }"
        :type="type"
    />
    <small :id="`${name}-help`" class="p-error">{{ errorMessage }}</small>
  </div>

  try this for useField + v-model
  https://stackoverflow.com/questions/70982713/how-can-i-use-custom-component-vee-validate-with-v-model
  haven't tried it yet
  -->
  <Field
      ref="internalRef"
      :name="name"
      v-model="localModel"
      v-slot="{ field, errorMessage }"
      :rules="rules"
  >
    <InputText
        v-bind="field"
        :class="[classDef, { 'p-invalid': errorMessage }]"
        :style="style"
    />
    <small v-if="errorMessage" class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
  </Field>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {PropType} from 'vue'
import {configure, defineRule, Field} from 'vee-validate';
import { required, integer, not_one_of } from '@vee-validate/rules';
import {localize} from "@vee-validate/i18n";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type:String
  },
  rules: {
    type: [String, Object],
  },
  classDef : {
    type: String
  },
  style: String
});

const localModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const emit = defineEmits(['update:modelValue'])

defineRule('required', required);
defineRule('integer', integer);
defineRule('not_one_of', not_one_of);

defineRule('redcap_field_name', (value:string) => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }
  // name starts with a letter and contains only lowercase letters, numbers and underscore
  if (!/^[a-z][a-z0-9_]+$/.test(value)) {
    return 'This value is not a valid redcap_field_name';
  }
  return true;
});

configure({
  // Generates an English message locale generator
  generateMessage: localize('en', {
    messages: {
      required: 'This field is required',
      integer: 'An integer is required',
      regex: 'This value does not match the field requirements',
      not_one_of: 'This field name is not unique.'
    },
  }),
});

</script>

<style lang="postcss" scoped>
.field * {
  display: block;
}
</style>
