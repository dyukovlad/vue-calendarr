<template>
  <header class="calendar-header">
    <div class="left-controls">
      <button type="button" @click="$emit('prev')" aria-label="previous month">‹</button>
      <button type="button" @click="$emit('today')" title="Go to today">Today</button>
      <button type="button" @click="$emit('next')" aria-label="next month">›</button>
    </div>

    <div class="title" role="heading" aria-live="polite">
      {{ monthNames[activeMonth] }} {{ activeYear }}
    </div>

    <div class="right-controls">
      <select v-model="localLocale" @change="onLocaleChange" aria-label="Locale">
        <option v-for="(label, code) in localesList" :key="code" :value="code">{{ code }}</option>
      </select>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { getMonthNames, builtinMonths } from '@/i18n/calendar.js';
const props = defineProps({
  activeYear: { type: Number, required: true },
  activeMonth: { type: Number, required: true },
  locale: { type: String, default: 'en' },
  i18n: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['prev', 'next', 'today', 'update:locale']);

const localesList = computed(() => ({ ...Object.fromEntries(Object.entries(builtinMonths).map(([k, v]) => [k, { months: v }])), ...props.i18n }));
const localLocale = ref(props.locale);

watch(
  () => props.locale,
  v => {
    localLocale.value = v;
  }
);

const onLocaleChange = () => emit('update:locale', localLocale.value);

const monthNames = computed(() => getMonthNames(localLocale.value, props.i18n));
</script>

<style scoped>
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #e6e6e6;
}
.left-controls button {
  margin-right: 6px;
}
.title {
  font-weight: 600;
}
.right-controls select {
  padding: 4px;
}
</style>
