import router from "@/router";
import { axios } from "../utils/axios/axios";
import { useTokenStore } from "./token";
import { useResetStore } from "./reset";
/* import { useUserStore } from "./user";
import { useEventStore } from "@/stores/event";
import { useDateStore } from "@/stores/date";
import { useOverviewStore } from "@/stores/overview";
import { useSelectionStore } from "@/stores/selection"; */

import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", () => {
  const tokenStore = useTokenStore();
  const resetStore = useResetStore();
  /*   const userStore = useUserStore();
  const eventStore = useEventStore();
  const dateStore = useDateStore();
  const overviewStore = useOverviewStore();
  const selectionStore = useSelectionStore(); */

  /*   const resetStores = () => {
    userStore.resetStore();
    resetStore();
    eventStore.resetStore();
    dateStore.resetStore();
    overviewStore.resetStore();
    selectionStore.resetStore();
    tokenStore.resetStore();
  }; */

  const startSession = async (data) => {
    const axiosResponseData = (
      await axios({
        method: "POST",
        url: "/auth/login",
        data: data,
      })
    ).data;

    tokenStore.accessToken = axiosResponseData.data.tokens.accessToken;
    tokenStore.refreshToken = axiosResponseData.data.tokens.refreshToken;

    router.push({
      name: "dashboard",
    });
  };

  const endSession = async () => {
    await axios({
      method: "POST",
      url: "/auth/logout",
      data: {
        refreshToken: tokenStore.refreshToken,
      },
    });

    resetStore.resetStores();

    router.push({
      name: "home",
    });
  };

  const _resetStore = () => {};

  return {
    startSession,
    endSession,
    resetStore: _resetStore,
  };
});
