const pad = n => String(n).padStart(2, '0');

const isoFromDate = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseISO = s => {
  if (!s) return new Date();
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s).trim());
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

const startOfMonth = (year, month) => new Date(year, month, 1);

const todayISO = () => isoFromDate(new Date());

export { isoFromDate, parseISO, startOfMonth, todayISO };
