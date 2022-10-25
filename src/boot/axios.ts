import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
import { LocalStorage } from 'quasar';
import { Auth } from 'components/models/auth';

const localStorage = LocalStorage.getItem('PembongkaranSimadaApp');

const api = axios.create({
  baseURL: process.env.API_URL,
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;

  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  api.interceptors.request.use(function (config) {
    if (localStorage) {
      const auth = JSON.parse(localStorage as string) as Auth;

      config.headers.Authorization = 'Bearer ' + auth.auth.token;
    }
    return config;
  });

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

// export { api };
