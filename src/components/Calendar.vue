<template>
  <div class="calendar-root">
    <CalendarHeader
      :activeYear="activeYear"
      :activeMonth="activeMonth"
      :locale="currentLocale"
      :i18n="i18n"
      @prev="prev"
      @next="next"
      @today="gotoToday"
      @update:locale="onLocaleUpdate"
    />

    <CalendarGrid
      :weeks="weeks"
      :selectedISO="selectedISO"
      :locale="currentLocale"
      :i18n="i18n"
      @select="onSelect"
      @update:selected="onUpdateSelected"
    />

    <footer class="calendar-footer">
      <small>Selected: {{ selectedISO }}</small>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';
import { useCalendar } from './useCalendar.js';

const props = defineProps({
  initialDate: { type: String, default: null },
  locale: { type: String, default: 'en' },
  i18n: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['select', 'update:date', 'update:locale']);

const {
  activeYear,
  activeMonth,
  selected,
  weeks,
  goToPreviousMonth,
  goToNextMonth,
  goToToday,
  setSelectedFromISO,
} = useCalendar(props.initialDate);

const currentLocale = ref(props.locale);

// если проп initialDate изменится извне — обновляем
watch(
  () => props.initialDate,
  v => {
    if (v) setSelectedFromISO(v);
  }
);

// если внешний locale изменится — синхронизируем
watch(
  () => props.locale,
  v => {
    if (v) currentLocale.value = v || 'en';
  }
);

const prev = () => goToPreviousMonth();
const next = () => goToNextMonth();
const gotoToday = () => goToToday();

const onSelect = payload => {
  // payload: { iso, date }
  // эмитируем внешний event 'select' и также публикуем update:date (v-model like)
  emit('select', payload);
  emit('update:date', payload.iso);
};

function onUpdateSelected(iso) {
  // внутреннее обновление выбранной даты
  // прокинем наружу для реактивности
  emit('update:date', iso);
}

function onLocaleUpdate(newLocale) {
  currentLocale.value = newLocale;
  emit('update:locale', newLocale);
}

// expose for debug or parent refs (опционально)
// defineExpose({ goToPreviousMonth, goToNextMonth, goToToday });
const selectedISO = selected;
</script>

<style scoped>
.calendar-root {
  width: 320px;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
  overflow: hidden;
  font-family:
    Inter,
    Roboto,
    system-ui,
    -apple-system,
    'Segoe UI',
    sans-serif;
}
.calendar-footer {
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #666;
}
</style>
