<template>
  <q-page class="row items-center justify-evenly">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      class="absolute-full"
      animated
    >
      <q-step
        :name="1"
        title="Pilih Jenis Sensus"
        icon="settings"
        :done="step > 1"
      >
        <SimadaStep1Form />
      </q-step>

      <q-step
        :name="2"
        title="Pilih Inventaris yang ingin di sensus"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <q-step :name="4" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 4 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import SimadaStep1Form from 'components/SimadaStep1Form.vue';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'SensusIndex',
  components: {
    SimadaStep1Form,
  },
  created() {
    // get the code if exists
    var url = new URL(window.location.href);
    var c = url.searchParams.get('code');
    if (c != '') {
      this.authCode = c;
      console.log(process.env.REDIRECT_IF_UNAUTHENTICATED);
    }
  },
  setup() {
    // const $q = useQuasar();
    // $q.loading.show({
    //   message: 'Please wait this page will redirect',
    // });
    const store = useStore();
    const authCode = computed({
      get: () => store.state.auth.code,
      set: (val) => {
        store.commit('auth/setCode', val);
      },
    });
    const step = ref(1);
    const selectedSensusType = '';
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { todos, meta, selectedSensusType, step, authCode };
  },
});
</script>
