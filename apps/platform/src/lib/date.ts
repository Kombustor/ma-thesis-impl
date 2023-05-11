export const dateToDatetimeLocal = (d: Date): string => {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, -1);
};

export const datetimeLocalToDate = (d: string): Date => {
  return new Date(d);
};
