const southAfricaLocale = "en-ZA";

export const formatDateKeyInTimeZone = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat(southAfricaLocale, {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  if (!day || !month || !year) {
    throw new Error("Could not format date key");
  }

  return `${year}-${month}-${day}`;
};

export const formatTimeLabelInTimeZone = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat(southAfricaLocale, {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    timeZone,
  }).format(date);

export const formatMonthWindow = (month: string) => {
  const [yearToken, monthToken] = month.split("-");
  const year = Number(yearToken);
  const monthIndex = Number(monthToken);

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 1 || monthIndex > 12) {
    throw new Error("Month must be in YYYY-MM format");
  }

  const start = new Date(`${month}-01T00:00:00+02:00`);
  const nextMonth =
    monthIndex === 12
      ? `${year + 1}-01`
      : `${year}-${`${monthIndex + 1}`.padStart(2, "0")}`;
  const end = new Date(`${nextMonth}-01T00:00:00+02:00`);

  return { end, start };
};
