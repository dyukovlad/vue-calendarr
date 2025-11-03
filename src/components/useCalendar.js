import { ref, computed } from 'vue';
import { isoFromDate, parseISO, startOfMonth } from '@/utils/date.js';

export const useCalendar = (initialDate = null) => {
  const today = new Date();
  const init = initialDate ? parseISO(initialDate) : today;
  const activeYear = ref(init.getFullYear());
  const activeMonth = ref(init.getMonth()); // 0..11
  const selected = ref(isoFromDate(init));

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
    let firstDayIndex = first.getDay();
    // Для понедельника: если воскресенье (0), то должно быть 6, иначе firstDayIndex - 1
    let gridStartOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const startDate = new Date(first);
    startDate.setDate(first.getDate() - gridStartOffset); // начало сетки (понедельник предыдущей)
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
  };
};
