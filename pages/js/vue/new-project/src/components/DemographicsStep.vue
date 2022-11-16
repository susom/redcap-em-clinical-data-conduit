<template>
  <v-stepper-content step="2">
    <v-card-text
      flat
    >
      <p>
        Select demographics below that you'd like to collect on your cohort.
        <br>
        <br>
        <em>Please bear in mind HIPAA Minimum Necessary when selecting identifying information.</em>
      </p>
    </v-card-text>

    <v-container>
      <v-checkbox
        v-model="demographics.selected"
        v-for="field in demographics.options"
        :label="field.label"
        :value="field"
        :key="field.id"
        dense
      >
      </v-checkbox>
      <v-btn
        color="primary"
        @click="toggleAllDemo"
      >
        Select/Unselect All
      </v-btn>
    </v-container>
  </v-stepper-content>
</template>

<script>
export default {
  name: "DemographicsStep",
  props: {
    'demographics_prop': Object
  },
  computed: {
    demographics: {
      get() {
        return this.demographics_prop;
      },
      set() {
        this.$emit('update:demographics_prop', this.demographics);
      }
    }
  },
  data: function() {
    return {}
  },
  methods: {
    toggleAllDemo() {
      if (this.demographics.selected.length != this.demographics.options.length) {
        this.demographics.selected = this.demographics.options;
      } else {
        this.demographics.selected = [];
      }
    }
  }
}
</script>

<style scoped>

</style>
