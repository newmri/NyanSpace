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

export function parseDateRange(startStr, endStr) {
  if (!startStr || !endStr) {
    throw new Error("start, end 날짜가 필요합니다.");
  }

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("잘못된 날짜 형식입니다.");
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}
