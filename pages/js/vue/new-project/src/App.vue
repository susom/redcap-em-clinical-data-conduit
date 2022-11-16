<template>
  <v-app>
    <v-container>
      <h1>DUSTER: Data Upload Service for Translational rEsearch on Redcap</h1>
    </v-container>
    <v-container
      v-if="!metadata_loaded"
    >
      <v-card-title>
        <h2 class="primary--text">Retrieving DUSTER metadata...</h2>
      </v-card-title>
    </v-container>
    <v-container
      v-if="metadata_loaded"
    >
      <NewProjectStepper/>
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
