<template>
  <q-page class="row items-center justify-evenly"></q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  created() {
    // get the code if exists
    let timer;
    const $q = useQuasar();
    $q.loading.show({
      message: 'Please wait this page will redirect',
    });
    var url = new URL(window.location.href);
    var c = url.searchParams.get('code');
    if (c) {
      // this.$router.push('/sensuasdasds');
      timer = setTimeout(() => {
        $q.loading.hide();
        timer = void 0;
        this.$router.push('/sensus');
      }, 3000);
    } else {
      window.location.href = process.env.REDIRECT_IF_UNAUTHENTICATED;
    }
  },
  setup() {
    const $q = useQuasar();
    $q.loading.show({
      message: 'Please wait this page will redirect',
      delay: 2000,
    });
    const store = useStore();
    const authCode = computed({
      get: () => store.state.auth.code,
      set: (val) => {
        store.commit('auth/setCode', val);
      },
    });

    return { authCode };
  },
});
</script>
