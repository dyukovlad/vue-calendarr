<template>
  <div>
    <Calendar
      initialDate="2025-11-01"
      :locale="locale"
      @select="onSelect"
      @update:date="onDateUpdate"
      @update:locale="onLocaleChanged"
    />
    <p>Выбранная дата: {{ selected }}</p>
    <button @click="locale = locale === 'en' ? 'ru' : 'en'">Переключить язык</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Calendar from '@/components/Calendar.vue';

const selected = ref(null);
const locale = ref('en');

const onSelect = payload => {
  selected.value = payload.iso;
};
const onDateUpdate = iso => {
  selected.value = iso;
};
const onLocaleChanged = newLocale => {
  locale.value = newLocale;
};
</script>
