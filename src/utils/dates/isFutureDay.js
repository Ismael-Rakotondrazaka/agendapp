export default (date) => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);

  return date.getTime() >= tomorrow.getTime();
};
