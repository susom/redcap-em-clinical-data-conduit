<template>
  <v-app>
    <v-container>    
      <h1>DUSTER: Data Upload Service for Translational rEsearch on Redcap</h1>    
      <NewProjectStepper v-if="metadata_loaded"/>
    </v-container>
  </v-app>
</template>

<script>

import NewProjectStepper from '@/components/NewProjectStepper';

export default {
  name: 'App',
  components: {
    NewProjectStepper
  },

  data: () => ({
    metadata_loaded: true
  }),
};
</script>
