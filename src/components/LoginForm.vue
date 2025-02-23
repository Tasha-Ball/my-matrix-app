<template>
  <div class="login-container">
    <div class="login">
      <h2 class="title">Вход в Matrix</h2>
      <input v-model="homeserver" placeholder="https://matrix.org" />
      <input v-model="username" placeholder="Логин" />
      <input v-model="password" type="password" placeholder="Пароль" />
      <button class="button-primary" @click="handleLogin" :disabled="isDisabled">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMatrixStore } from '@/store/matrixStore';
import { useRouter } from 'vue-router';

const store = useMatrixStore();
const router = useRouter();

const homeserver = ref(store.homeserver);
const username = ref('');
const password = ref('');
const disabled = ref(false);

const isFilled = computed(() => 
  !!(homeserver.value && username.value && password.value)
);

const isDisabled = computed(() => 
 !isFilled.value || disabled.value
);

const handleLogin = async () => {
  if (!isFilled.value) return

  disabled.value = true
  await store.login(username.value, password.value);

  if (store.isAuthenticated) {
    router.push('/chats');
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
