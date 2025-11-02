import { ref, computed } from 'vue';

const pad = (n) => String(n).padStart(2, '0');

const isoFromDate = (dt) =>
  `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;

const startOfMonth = (year, month) => new Date(year, month, 1);

// const endOfMonth = (year, month) => new Date(year, month + 1, 0);

export const useCalendar = (initialDate = null) => {
  const today = new Date();
  const init = initialDate ? parseISO(initialDate) : today;
  const activeYear = ref(init.getFullYear());
  const activeMonth = ref(init.getMonth()); // 0..11
  const selected = ref(isoFromDate(init));

  function parseISO(s) {
    // ожидаем YYYY-MM-DD, но робко парсим
    if (!s) return new Date();
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s.trim());
    if (!m) return new Date();
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  function goToPreviousMonth() {
    if (activeMonth.value === 0) {
      activeYear.value -= 1;
      activeMonth.value = 11;
    } else {
      activeMonth.value -= 1;
    }
  }

  function goToNextMonth() {
    if (activeMonth.value === 11) {
      activeYear.value += 1;
      activeMonth.value = 0;
    } else {
      activeMonth.value += 1;
    }
  }

  function goToToday() {
    const t = new Date();
    activeYear.value = t.getFullYear();
    activeMonth.value = t.getMonth();
    selected.value = isoFromDate(t);
  }

  function setSelectedFromDate(date) {
    selected.value = isoFromDate(date);
    activeYear.value = date.getFullYear();
    activeMonth.value = date.getMonth();
  }

  function setSelectedFromISO(iso) {
    const d = parseISO(iso);
    setSelectedFromDate(d);
  }

  // возвращаем недели — массив массивов дней (понедельник/воскресенье можно легко менять)
  const weeks = computed(() => {
    const year = activeYear.value;
    const month = activeMonth.value;
    const first = startOfMonth(year, month);
    // пусть неделя начинается с воскресенья (0), можно сделать опцией
    const firstDayIndex = first.getDay(); // 0..6 Sunday..Saturday
    const startDate = new Date(first);
    startDate.setDate(first.getDate() - firstDayIndex); // начало сетки (воскресенье предыдущей)
    const grid = [];
    let cursor = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const inMonth = cursor.getMonth() === month;
        days.push({
          date: new Date(cursor),
          iso: isoFromDate(cursor),
          day: cursor.getDate(),
          inMonth,
          timestamp: cursor.getTime(),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      grid.push(days);
    }
    return grid;
  });

  return {
    activeYear,
    activeMonth,
    selected,
    weeks,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    setSelectedFromISO,
    setSelectedFromDate,
    isoFromDate,
    parseISO,
  };
};
