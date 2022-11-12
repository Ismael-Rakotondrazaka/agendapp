const conflictWith = (start, end, interval) =>
  (interval.start >= start && interval.start < end && interval.end > end) ||
  (interval.start < start && interval.end > start && interval.end <= end) ||
  (interval.start >= start && interval.end <= end) ||
  (interval.start < start && interval.end > end);

/**
 * timestamps
 */
export default (start, end, intervals) => {
  let result = false;

  for (let i = 0; i < intervals.length; i++) {
    if (conflictWith(start, end, intervals[i])) {
      result = true;
      break;
    }
  }

  return result;
};
