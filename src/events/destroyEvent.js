import { useEventStore } from "@/stores/event";

const destroyEvent = (_id) => {
  const eventStore = useEventStore();

  eventStore.removeEvent(_id);
};

export { destroyEvent };
