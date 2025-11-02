<template>
  <div class="calendar-grid" @keydown="onKeydown" tabindex="0">
    <div class="weekdays">
      <div v-for="(d, i) in weekdayNames" :key="i" class="weekday">{{ d }}</div>
    </div>

    <div class="weeks">
      <div v-for="(week, wi) in weeks" :key="wi" class="week">
        <div
          v-for="day in week"
          :key="day.iso"
          class="day"
          :class="{
            'other-month': !day.inMonth,
            selected: day.iso === selectedISO,
            today: day.iso === todayISO,
          }"
          @click="onDayClick(day)"
          role="button"
          :aria-pressed="day.iso === selectedISO"
          :title="day.iso"
        >
          <span class="day-num">{{ day.day }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  weeks: { type: Array, required: true }, // from useCalendar.weeks
  selectedISO: { type: String, required: true },
  locale: { type: String, default: 'en' },
  i18n: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['select', 'update:selected']);

const today = new Date();
const pad = n => String(n).padStart(2, '0');
const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const builtinWeekdays = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};

const weekdayNames = computed(() => {
  if (props.i18n && props.i18n[props.locale] && props.i18n[props.locale].weekdays) {
    return props.i18n[props.locale].weekdays;
  }
  return builtinWeekdays[props.locale] || builtinWeekdays.en;
});

// отдаём объект { iso, date } и эмитируем update:selected для реактивности
const onDayClick = day => {
  emit('update:selected', day.iso);
  emit('select', { iso: day.iso, date: new Date(day.timestamp) });
};

const findSelectedPosition = () => {
  for (let wi = 0; wi < props.weeks.length; wi++) {
    const week = props.weeks[wi];
    for (let di = 0; di < week.length; di++) {
      if (week[di].iso === props.selectedISO) return { wi, di };
    }
  }
  return null;
};

const onKeydown = e => {
  const pos = findSelectedPosition();
  if (!pos) return;
  let { wi, di } = pos;
  if (e.key === 'ArrowLeft') {
    di -= 1;
  } else if (e.key === 'ArrowRight') {
    di += 1;
  } else if (e.key === 'ArrowUp') {
    wi -= 1;
  } else if (e.key === 'ArrowDown') {
    wi += 1;
  } else return;
  e.preventDefault();
  // нормализуем
  if (wi < 0) wi = 0;
  if (wi > props.weeks.length - 1) wi = props.weeks.length - 1;
  if (di < 0) {
    di = 6;
    wi = Math.max(0, wi - 1);
  }
  if (di > 6) {
    di = 0;
    wi = Math.min(props.weeks.length - 1, wi + 1);
  }
  const target = props.weeks[wi][di];
  if (target) onDayClick(target);
};
</script>

<style scoped>
.calendar-grid {
  outline: none;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 8px 0;
  font-weight: 600;
  color: #555;
}
.weeks {
  display: block;
}
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.day {
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  margin: 6px;
  cursor: pointer;
  user-select: none;
}
.day.other-month {
  opacity: 0.45;
}
.day.selected {
  background: #2b6cb0;
  color: white;
  font-weight: 700;
}
.day.today {
  box-shadow: inset 0 0 0 1px #2b6cb0;
}
.day:hover {
  transform: translateY(-2px);
  transition: 0.12s;
}
.day-num {
  display: inline-block;
  min-width: 20px;
}
</style>
