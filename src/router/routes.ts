import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/token',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/pengajuan',
        component: () => import('pages/pengajuan/Index.vue'),
        name: 'pengajuanIndex',
      },
      {
        path: '/pengajuan/form',
        component: () => import('pages/pengajuan/Form.vue'),
      },
      {
        path: '/pengajuan/validation',
        component: () => import('pages/pengajuan/Validation.vue'),
        name: 'validation',
      },
      {
        path: '/redirect',
        component: () => import('pages/redirect/Index.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
