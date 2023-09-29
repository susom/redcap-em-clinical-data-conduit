<template>
    <Dialog style="width:40vw;z-index: 9999;" visible header="System Error" :closable="false" modal>
        <p class="m-4">
            We have encountered a system level error and unable to process your request.
            Please email us at <a href="mailto:duster-info@lists.stanford.edu">duster-info@lists.stanford.edu</a> and we will
            let you know when this issue is resolved.
        </p>
        <template #footer>
            <Button label="Exit from DUSTER" icon="pi pi-times" class="p-button-secondary" @click="exitFromDuster" size="small" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import type {PropType} from "vue";

const props = defineProps({
  exitUrl: String
})

const exitFromDuster = () => {
  if (props.exitUrl) {
    //@ts-ignore
    window.location = props.exitUrl
  }
  window.history.go(-1);
}
</script>
