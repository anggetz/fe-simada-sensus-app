<template>
  <div>
    <q-select
      label="Silahkan Pilih jenis sensus"
      outlined
      v-model="selectedSensusType"
      :options="[]"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
