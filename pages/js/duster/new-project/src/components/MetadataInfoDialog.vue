<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import type { ComputedRef } from "vue";
import type FieldMetadata from "@/types/FieldMetadata";

const metadata = inject('metadata') as ComputedRef<FieldMetadata[]>;

const props = defineProps({
  initialFieldNameProp: {
    type: String,
    required: true
  }
});

const dusterFieldName = reactive({
  value: props.initialFieldNameProp
});

const visible = ref(false);

const fieldMeta = computed<FieldMetadata>(() => {
  let fieldMetaObj: FieldMetadata = {
    label: '',
    duster_field_name: '',
    category: ''
  };
  if (metadata.value) {
    let fieldMetaObj = metadata.value.find((field:FieldMetadata) => field.duster_field_name === dusterFieldName.value);
    if (fieldMetaObj) {
      return fieldMetaObj;
    }
  }
  return fieldMetaObj;
});

const fieldType = computed<String>(() => {
  let fieldType = '';
  if (fieldMeta.value.category != 'scores') {
    switch (fieldMeta.value.value_type) {
      case "numeric":
        fieldType = 'Number';
        break;
      case "boolean":
        fieldType = 'Boolean'
        if (fieldMeta.value.redcap_field_type = 'yesno') {
          fieldType += ' (Yes/No)';
        }
        break;
      case "text":
        fieldType = 'Text';
        if (fieldMeta.value.redcap_field_type = 'calc') {
          fieldType += ' (Calculated)';
        }
        break;
      case "coded_value":
        // TODO fieldType = '';
        if (fieldMeta.value.redcap_field_type = 'radio') {
          // TODO
          fieldType = 'Radio buttons (multiple choice-style)';
        }
        break;
      case "checkbox":
        // TODO
        fieldType = 'Checkbox(es)';
        break;
      case "datetime":
        fieldType = 'Datetime';
      case "date":
        fieldType = 'Date';
      default:
        break;
    }
  }
  return fieldType;
});

const getRelated = (relatedMetadataStr: string) => {
  let relatedFieldsArr:string[] = relatedMetadataStr.split(",");
  let relatedFieldsObjArr: Object[] = [];
  for (let relatedField of relatedFieldsArr) {
    let fieldMetaObj = metadata.value.find((field:FieldMetadata) => field.duster_field_name === relatedField);
    if (fieldMetaObj) {
      relatedFieldsObjArr.push(fieldMetaObj);
    }
  }
  return relatedFieldsObjArr;
}

const scoreDependencies = computed<Array<Object>>(() => {
  let dependenciesArr:Object[] = [];
  if (fieldMeta.value.category == 'scores' && fieldMeta.value?.subscores) {
    for (let subscore of fieldMeta.value.subscores) {
      if (subscore.dependencies) {
        for (let dependency of subscore.dependencies) {
          if (dependency) {
            let fieldMetaObj = metadata.value.find((field:FieldMetadata) => field.duster_field_name === dependency.duster_field_name);
            if (fieldMetaObj) {
              dependenciesArr.push({
                duster_field_name: dependency.duster_field_name,
                label: dependency.label,
                linkable: true
              });
            } else {
              dependenciesArr.push({
                duster_field_name: dependency.duster_field_name,
                // label: dependency.label + ' (* see Note)',
                label: dependency.label,
                linkable: false
              });
            }
          }
        }
      }
    }
  }
  return dependenciesArr;
});

/*
const subscoresArr = computed<Object>(() => {
  if (fieldMeta.category == 'scores' && fieldMeta?.subscores) {
    let subscoresArr: Object[] = [];
    for (let subscore of fieldMeta.subscores) {
      if(subscore.dependencies) {
        let subscoreObj = {
          'label': subscore.label,
          'dependencies': [] as string[]
        };
        let dependenciesArr: string[] = [];
        for (let dependency of subscore.dependencies) {
          let clinicalVar = '';
          // TODO what if the aggregation is a "closest to event" or "closest to time"?
          if (dependency.aggregates) {
            let aggregationsArr: String[] = [];
            for (let aggregate of dependency.aggregates) {
              switch (aggregate) {
                case "min_agg":
                  aggregationsArr.push("Minimum");
                  break;
                case "max_agg":
                  aggregationsArr.push("Maximum");
                  break;
                case "first_agg":
                  aggregationsArr.push("First");
                  break;
                case "last_agg":
                  aggregationsArr.push("Last");
                  break;
                default:
                  break;
              }
            }
            if (aggregationsArr.length > 0) {
              clinicalVar = aggregationsArr.join(", ");
            }
          }
          clinicalVar += " " + dependency.label;
          dependenciesArr.push(clinicalVar);
        }
        subscoreObj.dependencies = dependenciesArr;
        subscoresArr.push(subscoreObj);
      }
    }
    return subscoresArr;
 } else return {};
});
 */

</script>

<template>
  <Button
    v-if="fieldMeta.info_status === 'A'"
    icon="pi pi-info-circle"
    text rounded
    aria-label="Info"
    class="ml-2 pt-0 pb-0 mt-0 mb-0"
    style="height:1.3em"
    @click="visible = true"
  />
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :dismissableMask="true"
    :header="fieldMeta.label"
    :style="{ width: '40vw' }"
    @update:visible="dusterFieldName.value=initialFieldNameProp"
  >
    <p>
      {{ fieldMeta.description_short }}
    </p>


    <p v-if="fieldMeta.category=='scores'">
      <strong>Dependent clinical variables</strong>
      <!--
      <ul v-for="subscore in subscoresArr">
        {{ subscore.label }}
        <li v-for="clinicalVar in subscore.dependencies">
          {{ clinicalVar }}
        </li>
      </ul>
      -->
      <li v-for="clinicalVar in scoreDependencies">
        <Button
          v-if="(clinicalVar as any).linkable===true"
          :label="(clinicalVar as any).label"
          link
          @click="dusterFieldName.value=(clinicalVar as any).duster_field_name"
        />
        <!-- @vue-ignore -->
        <Button
          v-else-if="(clinicalVar as any).linkable===false"
          :label="(clinicalVar as any).label"
          link
          :disabled=true
        />
      </li>
    </p>





    <p v-if="fieldType!=''">
      <strong>Value type: </strong>{{ fieldType }}
    </p>
    <p v-if="fieldMeta.unit && fieldMeta.unit!=''">
      <strong>Unit of measurement: </strong>{{ fieldMeta.unit }}
    </p>
    <p v-if="fieldMeta.category=='labs' && fieldMeta.loinc_code!=''">
      <strong>LOINC code: </strong>{{ fieldMeta.loinc_code }}
    </p>
    <p v-if="fieldMeta.note && fieldMeta.note!=''">
      <strong>Note: </strong>{{ fieldMeta.note }}
    </p>
    <p v-if="fieldMeta.related && fieldMeta.related!=''">
      <strong>See also: </strong>
      <Button
        v-for="clinicalVar in getRelated(<string>fieldMeta.related)"
        :label="(clinicalVar as any).label"
        link
        small
        @click="dusterFieldName.value=(clinicalVar as any).duster_field_name"/>
    </p>
    <p>
      <!--
      <a
        href=""
        target="_blank"
      >
        See more
      </a>
      {{ fieldMeta.category=='scores' ? ' | ': '' }}
      -->
      <a
        :href="fieldMeta.mdcalc"
        target="_blank"
        v-if="fieldMeta.category=='scores' && fieldMeta.mdcalc!=''"
      >
        MDCalc
      </a>
      {{ fieldMeta.category=='scores' && fieldMeta.mdcalc!='' ? ' | ': '' }}
      <a
        :href="fieldMeta.pubmed"
        target="_blank"
        v-if="fieldMeta.category=='scores' && fieldMeta.pubmed!=''"
      >
        PubMed
      </a>
    </p>
  </Dialog>
</template>

<style scoped>

</style>
