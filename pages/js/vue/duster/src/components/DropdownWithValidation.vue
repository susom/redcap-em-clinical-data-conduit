<template>
  <!--
  couldn't get this way to work
  div class="field">
    <label v-if="label" for="name">{{ label }}</label>

    <Dropdown
        :id="name"
        v-model="value"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        placeholder="Please select an option"
    />

    <small id="email-help" class="p-error">{{ errorMessage }}</small>
  </div-->

  <!-- this only works if select returns a string, not an object -->
  <Field v-slot="{ field, errorMessage }"
         :name="name"
         v-model="localModel"
         :rules="rules"
  >
    <Dropdown
        v-bind="field"
        :options="options"
        :class="[classDef,{ 'p-invalid': errorMessage }]"
        :modelValue="field.value"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :placeholder="placeholder"
        :style="style"
        @input="//@ts-ignore
          field.onInput.forEach((fn) => fn($event.value))"
        @change="//@ts-ignore
          field.onChange.forEach((fn) => fn($event.value))"
    />
    <small v-if="errorMessage" class="p-error">{{ errorMessage || '&nbsp;' }}</small>

  </Field>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import type {PropType}  from "vue";
import { Field } from 'vee-validate';
import { defineRule, configure } from 'vee-validate';
import { required } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String
  },
  rules: {
    type: String,
  },
  classDef : String,
  style: String,
  options: {
    type: Array as PropType<any>,
    required: true
  },
  optionLabel: String,
  optionValue: String,
  placeholder: String
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

configure({
  // Generates an English message locale generator
  generateMessage: localize('en', {
    messages: {
      required: 'This field is required'
    },
  }),
});
</script>
