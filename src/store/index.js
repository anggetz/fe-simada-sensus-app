import { createStore } from 'vuex';
import auth from './modules/auth';
import VuexPersist from 'vuex-persist';

// const debug = process.env.NODE_ENV !== 'production';

const vuexLocal = new VuexPersist({
  key: 'PembongkaranSimadaApp',
  storage: window.localStorage,
});

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
    plugins: [vuexLocal.plugin],
  });

  return Store;
}
