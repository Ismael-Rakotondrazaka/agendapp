import { useEventStore } from "@/stores/event";

const updateEvent = (event) => {
  const eventStore = useEventStore();

  const formattedEvent = { ...event };
  formattedEvent.startAt = new Date(formattedEvent.startAt);
  formattedEvent.endAt = new Date(formattedEvent.endAt);
  formattedEvent.createdAt = new Date(formattedEvent.createdAt);
  formattedEvent.updatedAt = new Date(formattedEvent.updatedAt);

  eventStore.addOrUpdateEvent(formattedEvent);
};

export { updateEvent };
