<template>
  <q-layout view="lHh Lpr lFf" v-if="userInfo !== undefined">
    <q-header elevated class="bg-green-7">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="float-right">{{
          userInfo.organisasi.nama
        }}</q-toolbar-title>

        <!-- <q-toolbar-title> Sensus </q-toolbar-title> -->

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <img src="~assets/logo.png" width="220" class="center" />
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :link="link.router"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { User, Organisasi } from 'components/models/auth';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const user = ref<User>({
      organisasi: {
        nama: '',
      },
    });

    const store = useStore();

    const userInfo = computed({
      get: () => {
        const info = store.state.auth.info;

        if (info != undefined && info.organisasi != undefined) {
          return info as User;
        } else {
          return {
            organisasi: {
              nama: '',
            },
          };
        }
      },
      set: (val: any) => {
        store.commit('auth/setInfo', val);
      },
    });

    const linksList = ref([]);

    return {
      user,
      userInfo,
      linksList,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  mounted() {
    this.setupMenu();
  },
  methods: {
    setupMenu() {
      this.essentialLinks.push({
        title: 'Dashboard',
        caption: '',
        icon: 'home',
        router: '/pengajuan',
      });

      this.essentialLinks.push({
        title: 'Pengajuan',
        caption: '',
        icon: 'edit',
        router: '/pengajuan/form/create',
      });
    },
  },
});
</script>
