<template>
  <nav>
    <div class="grid">
      <div class="col">
        <a class="brand-logo" href="https://med.stanford.edu/" target="_blank">Stanford Medicine</a>
        <div style="display:inline;float:left" class="mt-2">
          <div class="font-bold text-left" style="font-size:1.25em;">DUSTER</div>
          <div class="text-sm font-italic">Research Technology, TDS</div>
        </div>
      </div>
      <div class="col mt-1">
        <p class="text-xl font-italic">Data Upload Service for Translational rEsearch on Redcap</p>
      </div>
    </div>
    <div class="grid text-white text-lg" style="background-color: #53565A;">
      <div class="col-offset-9 col-2">
        <a href="https://med.stanford.edu/duster" class="text-white" target="_blank">Duster Website</a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
nav {
  padding: 10px;
  text-align: center;
}
.brand-logo {
  position: relative;
  z-index: 10;
  float: left;
  display: block;
  width: 12em;
  height: 3em;
  margin-right: 10px;
  margin-right: .7em;
  text-indent: -9999px;
  background: url(@assets/images/logo_uid_stanfordmedicine.svg) no-repeat;
  background-position: -11px -1px;
  background-position: -0.7857142857142857rem -0.07142857142857142rem;
  background-size: auto 111%;
  border-right: 1px solid;
  border-right: .07142857142857142rem solid;
  border-right-color: #000;
}

</style>
