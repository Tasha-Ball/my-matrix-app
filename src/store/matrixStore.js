import { defineStore } from 'pinia';
import * as sdk from "matrix-js-sdk";

const MATRIX_SERVER = "https://matrix.org";

export const useMatrixStore = defineStore('matrix', {
  state: () => ({
    client: null,
    userId: '',
    accessToken: '',
    homeserver: MATRIX_SERVER,
    isAuthenticated: false,
    rooms: []
  }),
  
  actions: {
    async login(username, password) {
      this.client = await sdk.createClient({ baseUrl: this.homeserver });

      try {
        const hostname = new URL(this.homeserver).hostname || 'matrix.org'
        const response = await this.client.login("m.login.password", {
          user: `@${username}:${hostname}`,
          password: password,
        });

        this.userId = response.user_id;
        this.accessToken = response.access_token;
        this.isAuthenticated = true;

        localStorage.setItem('matrixToken', this.accessToken);
        localStorage.setItem('matrixUserId', this.userId);

        this.client.startClient();
      } catch (error) {
        console.error("Ошибка входа:", error);
      }
    },

    async loadRooms() {
      if (!this.client) return;
    
      await new Promise((resolve) => {
        this.client.once("sync", function (state) {
          if (state === "PREPARED") resolve();
        });
      });
    
      const rooms = this.client.getRooms();
    
      if (!rooms.length) return;
    
      this.rooms = rooms.map(room => {
        let lastMessage = room.timeline.length > 0 
          ? room.timeline[room.timeline.length - 1].event.content.body || "Нет сообщений"
          : "Нет сообщений";

        this.client.on("Room.timeline", function(event) {
          lastMessage = event.event.content.body
        });

        return {
          id: room.roomId,
          name: room.name || `Комната ${room.roomId}`,
          lastMessage,
          unreadCount: room.getUnreadNotificationCount() || 0,
          avatarUrl: room.getAvatarUrl?.(this.client.baseUrl, 50, 50, "crop") || null,
        };
      });
    },    

    logout() {
      localStorage.clear();
      this.client = null;
      this.isAuthenticated = false;
      this.rooms = [];
    }
  }
});
