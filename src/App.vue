<template>
  <div>
    <!-- :i18n="customI18n" -->
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

// const customI18n = {
//   ru: {
//     months: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
//     weekdays: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
//   }
// };

const onSelect = payload => {
  console.log('select event ->', payload);
  selected.value = payload.iso;
};
const onDateUpdate = iso => {
  selected.value = iso;
};
const onLocaleChanged = local => {
  console.log('locale ->', local);
};
</script>
