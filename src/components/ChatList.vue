<template>
  <div class="chat-list-container">
    <div class="chat-list">
      <div class="chat-actions">
        <button class="button-secondary" @click="handleLogout">Выход</button>
      </div>
      <h2 class="title">Список чатов</h2>
      <p v-if="load" class="chat-text">Загрузка...</p>
      <ul v-else-if="sortedRooms.length" class="chat-list-content">
        <li v-for="room in sortedRooms" :key="room.id" class="chat-item">
          <div class="chat-avatar">
            <img v-if="room.avatarUrl" :src="room.avatarUrl">
          </div>
          <div class="chat-info">
            <h3 class="chat-title">{{ room.name }}</h3>
            <p class="chat-last-message">{{ room.lastMessage }}</p>
          </div>
          <span v-if="room.unreadCount > 0" class="chat-unread">({{ room.unreadCount }} непрочитанных)</span>
        </li>
      </ul>
      <p v-else class="chat-text">Чатов пока нет</p>
    </div>
  </div>
</template>

<script setup>
import { useMatrixStore } from '@/store/matrixStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useMatrixStore();
const router = useRouter();
const load = ref(true);

const handleLoadRooms = async () => {
  load.value = true;
  try {
    await store.loadRooms();
    load.value = false;
  } catch {
    console.log(new Error())
    load.value = false;
  }
}

const sortedRooms = computed(() =>
  store.rooms.sort((a, b) => a.name.localeCompare(b.name))
);

const handleLogout = async () => {
  await store.logout();

  if (!store.isAuthenticated) {
    router.push('/');
  }
};

handleLoadRooms();
</script>

<style scoped>
.chat-list-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.chat-list {
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 10px;
}

/* Кнопки */
.chat-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Список чатов */
.chat-list-content {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Отдельный чат */
.chat-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-item:hover {
  background: #f7f7f7;
}

/* Аватар чата */
.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  background: #ddd;
}
.chat-avatar img {
  object-fit: cover;
  width: auto;
  height: 100%;
}

/* Информация о чате */
.chat-info {
  flex: 1;
}

.chat-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-last-message {
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Количество непрочитанных сообщений */
.chat-unread {
  background: #ff3b30;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 50%;
  min-width: 20px;
  text-align: center;
}

.chat-text {
  text-align: center;
  color: #777;
  padding: 15px;
}
</style>
