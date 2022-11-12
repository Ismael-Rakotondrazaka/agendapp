import formatDate from "@/utils/dates/formatDate";
import formatTime from "@/utils/dates/formatTime";

export default (date) => `${formatDate(date)} at ${formatTime(date)}`;
