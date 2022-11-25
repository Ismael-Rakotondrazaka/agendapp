import { useSelectionStore } from "./selection";
import { axios } from "../utils/axios/axios";

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useEventStore = defineStore("event", () => {
  const selectionStore = useSelectionStore();

  const events = ref([]);

  /**
    Check if an array of events cover a journey.\
    But there is a few rules:
      - events must be in the same day
      - min startAt is 00:00
      - max endAt is 00:00 of next day
  */
  const canAddEvent = (events) => {
    let result = false;

    if (events.length === 0) {
      result = true;
    } else if (events.length === 1) {
      if (events[0].startAt.getHours() !== 0) {
        result = true;
      } else if (events[0].endAt.getHours() !== 0) {
        result = true;
      } else if (events[0].endAt.getMinutes() !== 0) {
        result = true;
      }
    } else {
      if (events[0].startAt.getHours() !== 0) {
        result = true;
      }

      for (let i = 1; i < events.length; i++) {
        if (events[i].startAt.getHours() !== events[i - 1].endAt.getHours()) {
          result = true;
        } else if (
          events[i].startAt.getMinutes() !== events[i - 1].endAt.getMinutes()
        ) {
          result = true;
        } else if (
          i === events.length - 1 &&
          events[i].endAt.getHours() !== 0
        ) {
          result = true;
        } else if (events[i].endAt.getMinutes() !== 0) {
          result = true;
        }
      }
    }

    return result;
  };

  const daysFull = computed(() => {
    let result = [];

    const keyExcluded = ["failedCount", "pendingCount", "completedCount"];

    for (const yearKey in sortedEvents.value) {
      if (
        !keyExcluded.includes(yearKey) &&
        Object.hasOwnProperty.call(sortedEvents.value, yearKey)
      ) {
        for (const monthKey in sortedEvents.value[yearKey]) {
          if (
            !keyExcluded.includes(monthKey) &&
            Object.hasOwnProperty.call(sortedEvents.value[yearKey], monthKey)
          ) {
            for (const dateKey in sortedEvents.value[yearKey][monthKey]) {
              if (
                !keyExcluded.includes(dateKey) &&
                Object.hasOwnProperty.call(
                  sortedEvents.value[yearKey][monthKey],
                  dateKey
                )
              ) {
                const events = [
                  ...sortedEvents.value[yearKey][monthKey][dateKey].pending,
                  ...sortedEvents.value[yearKey][monthKey][dateKey].completed,
                  ...sortedEvents.value[yearKey][monthKey][dateKey].failed,
                ];

                events.sort(
                  (a, b) => a.startAt.getTime() - b.startAt.getTime()
                );

                if (!canAddEvent(events)) {
                  const dateArgs = dateKey.split("-");

                  result.push(
                    new Date(dateArgs[0], dateArgs[1] - 1, dateArgs[2])
                  );
                }
              }
            }
          }
        }
      }
    }

    return result;
  });

  const addOrUpdateEvent = (event) => {
    const eventFound = events.value.find(
      (eventToCompare) => eventToCompare._id === event._id
    );

    // if the event already exists, we update it
    if (eventFound) {
      for (const key in event) {
        if (Object.hasOwnProperty.call(event, key)) {
          eventFound[key] = event[key];
        }
      }
    }
    // or we just push it
    else {
      events.value.push(event);
    }
  };

  const removeEvent = (_id) => {
    const index = events.value.findIndex((event) => event._id === _id);

    if (index !== -1) {
      events.value.splice(index, 1);
    }
  };

  const storeEvent = async (data) => {
    const axiosResponseData = (
      await axios({
        method: "POST",
        url: "/events",
        data: data,
      })
    ).data;

    addOrUpdateEvent({
      ...axiosResponseData.data.event,
      startAt: new Date(axiosResponseData.data.event.startAt),
      endAt: new Date(axiosResponseData.data.event.endAt),
      createdAt: new Date(axiosResponseData.data.event.createdAt),
      updatedAt: new Date(axiosResponseData.data.event.updatedAt),
    });
  };

  const destroyEvent = async (_id) => {
    await axios({
      method: "DELETE",
      url: `/events/${_id}`,
    });

    removeEvent(_id);
  };

  const updateEvent = async (_id, newValue) => {
    const axiosResponseData = (
      await axios({
        method: "PUT",
        url: `/events/${_id}`,
        data: newValue,
      })
    ).data;

    addOrUpdateEvent({
      ...axiosResponseData.data.event,
      startAt: new Date(axiosResponseData.data.event.startAt),
      endAt: new Date(axiosResponseData.data.event.endAt),
      createdAt: new Date(axiosResponseData.data.event.createdAt),
      updatedAt: new Date(axiosResponseData.data.event.updatedAt),
    });
  };

  const showEvent = async (_id) => {
    return await axios({
      method: "GET",
      url: `/events/${_id}`,
    });
  };

  const eventsOnDaySelected = computed(() => {
    let result = [];

    if (selectionStore.hasSelection) {
      const yearKey = `${selectionStore.date.getFullYear()}`;
      const monthKey = `${yearKey}-${(selectionStore.date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`; // ! January => 1

      const dateKey = `${monthKey}-${selectionStore.date
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      if (sortedEvents.value?.[yearKey]?.[monthKey]?.[dateKey]) {
        result.push(
          ...sortedEvents.value[yearKey][monthKey][dateKey].pending,
          ...sortedEvents.value[yearKey][monthKey][dateKey].completed,
          ...sortedEvents.value[yearKey][monthKey][dateKey].failed
        );

        result.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
      }
    }

    return result;
  });

  const sortedEvents = computed(() => {
    let result = {
      failedCount: 0,
      completedCount: 0,
      pendingCount: 0,
    };

    events.value.forEach((event) => {
      const yearKey = `${event.startAt.getFullYear()}`;
      const monthKey = `${yearKey}-${(event.startAt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`; // ! January => 1
      const dateKey = `${monthKey}-${event.startAt
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      if (!Object.hasOwnProperty.call(result, yearKey)) {
        result[yearKey] = {
          failedCount: 0,
          completedCount: 0,
          pendingCount: 0,
        };
      }

      if (!Object.hasOwnProperty.call(result[yearKey], monthKey)) {
        result[yearKey][monthKey] = {
          failedCount: 0,
          completedCount: 0,
          pendingCount: 0,
        };
      }

      if (!Object.hasOwnProperty.call(result[yearKey][monthKey], dateKey)) {
        result[yearKey][monthKey][dateKey] = {
          failed: [],
          completed: [],
          pending: [],
          failedCount: 0,
          completedCount: 0,
          pendingCount: 0,
        };
      }

      const eventStatusCountKey = `${event.status}Count`;

      result[eventStatusCountKey]++;
      result[yearKey][eventStatusCountKey]++;
      result[yearKey][monthKey][eventStatusCountKey]++;
      result[yearKey][monthKey][dateKey][eventStatusCountKey]++;

      result[yearKey][monthKey][dateKey][event.status].push(event);
    });

    return result;
  });

  const fetchEvents = async () => {
    const axiosResponseData = (
      await axios({
        method: "GET",
        url: "/events",
      })
    ).data;

    events.value = axiosResponseData.data.events.map((event) => ({
      ...event,
      startAt: new Date(event.startAt),
      endAt: new Date(event.endAt),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
    }));
  };

  const resetStore = () => {
    events.value = [];
  };

  return {
    events,
    eventsOnDaySelected,
    daysFull,
    sortedEvents,
    addOrUpdateEvent,
    removeEvent,
    fetchEvents,
    showEvent,
    storeEvent,
    destroyEvent,
    updateEvent,
    resetStore,
  };
});
