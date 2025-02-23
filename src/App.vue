<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import { useMatrixStore } from '@/store/matrixStore';
import { useRouter } from 'vue-router';
import * as sdk from "matrix-js-sdk";

const store = useMatrixStore();
const router = useRouter();

if (localStorage.getItem('matrixToken')) {
  store.accessToken = localStorage.getItem('matrixToken');
  store.userId = localStorage.getItem('matrixUserId');
  store.isAuthenticated = true;
  store.client = sdk.createClient({
    baseUrl: store.homeserver,
    accessToken: store.accessToken,
    userId: store.userId,
  });
  store.client.startClient();
  router.push('/chats');
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>

