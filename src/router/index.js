import { createRouter, createWebHistory } from 'vue-router';
import { useMatrixStore } from '@/store/matrixStore';
import LoginForm from '@/components/LoginForm.vue';
import ChatList from '@/components/ChatList.vue';

const routes = [
  { path: '/', component: LoginForm },
  { path: '/chats', component: ChatList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const store = useMatrixStore();
  const isAuthenticated = store.isAuthenticated || localStorage.getItem('matrixToken');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export { router };
