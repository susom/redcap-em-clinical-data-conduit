<template>
  <v-container>
    <v-stepper-content step="1">
      <h1>{{ greetingFull }}</h1>
    </v-stepper-content>
  </v-container>
</template>

<script>
export default {
  name: "ResearcherProvidedInfoStep",
  props: ['greeting'],
  computed: {
    greetingFull: function() {
      return this.greeting + ' World';
    }
  },
  data: function() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
