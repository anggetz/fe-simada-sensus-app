<template>
  <q-page class="row items-center justify-evenly"></q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { OauthClientsModel } from 'components/models/oauth_clients';
import { User } from 'components/models/auth';

export default defineComponent({
  name: 'IndexPage',
  methods: {
    async getInfoUser(token: string, callback: any) {
      this.$api.get('api/v1/pembongkaran/auth/me').then((response: any) => {
        let data = { response };
        console.log(data.response.data.data);
        callback(data.response.data.data as User);
      });
    },
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
  async created() {
    // get the code if exists
    const store = useStore();

    store.commit('auth/setWebGuardToken', '');
    store.commit('auth/setToken', '');
    store.commit('auth/setInfo', {});

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
            timer = void 0;
            store.commit('auth/setCode', c);
            store.commit('auth/setToken', token.access_token);

            setTimeout(() => {
              this.getInfoUser(token.access_token, (userInfo: User) => {
                store.commit('auth/setInfo', userInfo);
                this.$router.push('/pengajuan'), null, { shallow: true };

                $q.loading.hide();
              });
            }, 5000);
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
