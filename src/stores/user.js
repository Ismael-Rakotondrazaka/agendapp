import router from "@/router";
import { axios } from "../utils/axios/axios";
import { useTokenStore } from "./token";

import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const tokenStore = useTokenStore();

  const user = ref(null);

  const registerUser = async (data) => {
    const axiosResponseData = (
      await axios({
        method: "POST",
        url: "/auth/register",
        data: data,
      })
    ).data;

    tokenStore.accessToken = axiosResponseData.data.tokens.accessToken;
    tokenStore.refreshToken = axiosResponseData.data.tokens.refreshToken;

    router.push({
      name: "dashboard",
    });
  };

  const fetchUser = async () => {
    const axiosResponseData = (
      await axios({
        method: "GET",
        url: "/auth/whoami",
      })
    ).data;

    const userData = {
      ...axiosResponseData.data.user,
    };
    userData.createdAt = new Date(userData.createdAt);
    userData.updatedAt = new Date(userData.updatedAt);
    user.value = userData;
  };

  const resetStore = () => {
    user.value = null;
  };

  return {
    user,
    registerUser,
    fetchUser,
    resetStore,
  };
});
