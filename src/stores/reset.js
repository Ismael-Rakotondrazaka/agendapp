import { defineStore } from "pinia";
import { useDateStore } from "./date";
import { useTokenStore } from "./token";
import { useUserStore } from "./user";
import { useSessionStore } from "./session";
import { useEventStore } from "./event";
import { useOverviewStore } from "./overview";
import { useSelectionStore } from "./selection";
import { useSocketStore } from "./socket";

export const useResetStore = defineStore("reset", () => {
  const tokenStore = useTokenStore();
  const userStore = useUserStore();
  const sessionStore = useSessionStore();
  const eventStore = useEventStore();
  const dateStore = useDateStore();
  const overviewStore = useOverviewStore();
  const selectionStore = useSelectionStore();
  const socketStore = useSocketStore();

  const resetStores = () => {
    userStore.resetStore();
    sessionStore.resetStore();
    eventStore.resetStore();
    dateStore.resetStore();
    overviewStore.resetStore();
    selectionStore.resetStore();
    tokenStore.resetStore();
    socketStore.resetStore();
  };

  return {
    resetStores,
  };
});
