<template>
  <q-page class="row items-center justify-evenly"></q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { OauthClientsModel } from 'components/models/oauth_clients';

export default defineComponent({
  name: 'IndexPage',
  methods: {
    getToken: function (
      code: string | null,
      config: OauthClientsModel,
      callback: any
    ) {
      this.$api
        .post('oauth/token', {
          grant_type: 'authorization_code',
          client_id: config.id,
          client_secret: config.secret,
          redirect_uri: config.redirect,
          code: code,
        })
        .then((response: any) => {
          let { data } = response;
          console.log(response, data);
          callback(data);
        });
    },
    getConfig: function (callback: any) {
      this.$api
        .get('api/public/v1/global/setup/get?code_id=pembongkaran')
        .then((response: any) => {
          let { data } = response;

          callback(data as OauthClientsModel);
        });
    },
  },
  created() {
    // get the code if exists
    const store = useStore();
    let timer;
    const $q = useQuasar();
    $q.loading.show({
      message: 'Please wait this page will redirect',
    });
    var url = new URL(window.location.href);
    const c = url.searchParams.get('code');
    const web_token_guard = url.searchParams.get('web_token_guard');

    if (c) {
      // this.$router.push('/sensuasdasds');
      timer = setTimeout(() => {
        store.commit('auth/setWebGuardToken', web_token_guard);

        this.getConfig((data: OauthClientsModel) => {
          this.getToken(c, data, (token: any) => {
            $q.loading.hide();
            timer = void 0;
            this.$router.push('/');
            console.log(token.access_token, token);
            store.commit('auth/setCode', c);
            store.commit('auth/setToken', token.access_token);
          });
        });
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
