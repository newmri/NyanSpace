export function formatDateToLocalYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 1월=0이므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  const now = new Date();
  return formatDateToLocalYYYYMMDD(now);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDateRange(mode, now = new Date()) {
  if ("week" === mode) {
    const day = now.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - diffToMonday);
    const calculatedEnd = new Date(startDate);
    calculatedEnd.setDate(startDate.getDate() + 6);

    const endDate = calculatedEnd > now ? now : calculatedEnd;

    return {
      start: formatDateToLocalYYYYMMDD(startDate),
      end: formatDateToLocalYYYYMMDD(endDate),
    };
  }

  if ("month" === mode) {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDate = now < monthEndDate ? now : monthEndDate;

    return {
      start: formatDateToLocalYYYYMMDD(startDate),
      end: formatDateToLocalYYYYMMDD(endDate),
    };
  }

  if ("year" === mode) {
    const startDate = new Date(now.getFullYear(), 0, 1);
    const yearEndDate = new Date(now.getFullYear(), 11, 31);
    const endDate = yearEndDate > now ? now : yearEndDate;

    return {
      start: formatDateToLocalYYYYMMDD(startDate),
      end: formatDateToLocalYYYYMMDD(endDate),
    };
  }

  return { start: null, end: null };
}

export function getMonthWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // 월요일=0, 일요일=6
  return Math.ceil((date.getDate() + dayOfWeek) / 7);
}
