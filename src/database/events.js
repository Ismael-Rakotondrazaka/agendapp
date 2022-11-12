const roundDateTo = (date, interval) => {
  const result = new Date(date);
  result.setSeconds(0);
  result.setMilliseconds(0);

  const newMinutes = Math.round(result.getMinutes() / interval) * interval; // get 0, 15, 30, 60
  const diff = newMinutes - result.getMinutes();
  const diffMilliSeconds = diff * 60 * 1000;

  result.setTime(result.getTime() + diffMilliSeconds);
  return result;
};

const todayDateStart = new Date();
todayDateStart.setHours(0, 0, 0, 0);

const tomorrowDateStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
tomorrowDateStart.setHours(0, 0, 0, 0);

const d3 = new Date(Date.now() + 24 * 60 * 60 * 1000);
d3.setHours(-4, 0, 0, 0);

const d4 = new Date(Date.now() + 24 * 60 * 60 * 1000);
d4.setHours(-2, 0, 0, 0);

export default [
  /* {
    _id: "a",
    title: "Health check to doctor Smith",
    description: "Radiology and scanner",
    status: "pending",
    level: "important",
    startAt: todayDateStart, // now + 1h
    endAt: tomorrowDateStart, // now + 2h 30mn
    createdAt: new Date(),
    updatedAt: new Date(),
  }, */
  {
    _id: "1",
    title: "Health check to doctor Smith",
    description: "Radiology and scanner",
    status: "pending",
    level: "important",
    startAt: roundDateTo(new Date(Date.now() + 1 * 60 * 60 * 1000), 15), // now + 1h
    endAt: roundDateTo(new Date(Date.now() + (2 * 60 + 30) * 60 * 1000), 15), // now + 2h 30mn
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    title: "Health check to doctor Smith",
    description: "Radiology and scanner",
    status: "pending",
    level: "important",
    startAt: roundDateTo(new Date(Date.now() - (5 * 60 + 45) * 60 * 1000), 15), // now - 5h 15mn
    endAt: roundDateTo(new Date(Date.now()) - 5 * 60 * 60 * 1000, 15), // now - 5h
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    title: "Health check to doctor Smith",
    description: "Radiology and scanner",
    status: "pending",
    level: "important",
    startAt: roundDateTo(new Date(Date.now() + 7 * 60 * 60 * 1000), 15), // now + 7h
    endAt: roundDateTo(new Date(Date.now() + (8 * 60 + 30) * 60 * 1000), 15), // now + 7h 30mn
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    title: "Basket-ball TV with family",
    description: "Final NBA 2022",
    status: "pending",
    level: "normal",
    startAt: roundDateTo(new Date(Date.now() + (24 + 5) * 60 * 60 * 1000), 15),
    endAt: roundDateTo(new Date(Date.now() + (24 + 7) * 60 * 60 * 1000), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "5",
    title: "Oral exam",
    description: "DELF at Alliance Française Antananarivo",
    status: "completed",
    level: "important",
    startAt: roundDateTo(new Date(Date.now() - (24 + 8) * 60 * 60 * 1000), 15),
    endAt: roundDateTo(new Date(Date.now() - (24 + 6) * 60 * 60 * 1000), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "6",
    title: "Final preparation for DELF exam",
    description: "DELF at Alliance Française Antananarivo",
    status: "failed",
    level: "important",
    startAt: roundDateTo(new Date(Date.now() - (24 + 4) * 60 * 60 * 1000), 15),
    endAt: roundDateTo(new Date(Date.now() - (24 + 2) * 60 * 60 * 1000), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "7",
    title: "Find me",
    description: "DELF at Alliance Française Antananarivo",
    status: "pending",
    level: "normal",
    startAt: roundDateTo(new Date(Date.now() - 0), 15),
    endAt: roundDateTo(new Date(Date.now() + 15 * 60 * 1000), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "8",
    title: "Here dap",
    description: "DELF at Alliance Française Antananarivo",
    status: "pending",
    level: "normal",
    startAt: roundDateTo(new Date(Date.now() - 24 * 60 * 60 * 1000), 15),
    endAt: roundDateTo(new Date(Date.now() - 20 * 60 * 60 * 1000), 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
