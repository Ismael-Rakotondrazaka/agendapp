import router from "@/router";
import { useTokenStore } from "./token";
import { useResetStore } from "./reset";

import { ref } from "vue";
import { defineStore } from "pinia";

import { io } from "socket.io-client";

import { storeEvent, updateEvent, destroyEvent } from "../events";
const eventFunction = {
  "events:store": storeEvent,
  "events:update": updateEvent,
  "events:destroy": destroyEvent,
};

export const useSocketStore = defineStore("socket", () => {
  const tokenStore = useTokenStore();
  const resetStore = useResetStore();

  const socketClient = ref(null);

  const isConnected = ref(false);

  const connect = () => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || "";
    const socketIO = io(backendUrl, {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${tokenStore.refreshToken}`,
      },
    });

    socketIO.onAny(async function (eventName, payload) {
      eventFunction[eventName]?.(payload);
    });

    socketIO.on("connect_error", (err) => {
      // got a forbidden error, so need to login again
      if (err?.data?.error?.statusCode === 403) {
        resetStore.resetStores();

        router.push({
          name: "login",
        });
      }
    });

    socketClient.value = socketIO;
  };

  const _resetStore = () => {
    if (socketClient.value) {
      socketClient.value.close();
    }
    socketClient.value = null;
    isConnected.value = false;
  };

  return {
    socketClient,
    isConnected,
    connect,
    resetStore: _resetStore,
  };
});
