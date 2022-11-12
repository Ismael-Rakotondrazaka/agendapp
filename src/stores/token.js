import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ls } from "../utils/axios/LSSecure";

export const useTokenStore = defineStore(
  "token",
  () => {
    const accessToken = ref("");

    const refreshToken = ref("");

    const hasRefreshToken = computed(() => refreshToken.value.length > 0);

    const resetStore = () => {
      accessToken.value = "";
      refreshToken.value = "";
    };

    return {
      accessToken,
      refreshToken,
      hasRefreshToken,
      resetStore,
    };
  },
  {
    persist: {
      key: "zinc",
      paths: ["refreshToken"],
      serializer: {
        serialize: (data) => ls.processData(data),
        deserialize: () => ls.get("zinc"),
      },
    },
  }
);
