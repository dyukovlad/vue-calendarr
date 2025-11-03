// Built-in i18n data for calendar components
export const builtinMonths = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ru: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
};

export const builtinWeekdays = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
};

export const getMonthNames = (locale, overrides) => {
  if (overrides && overrides[locale] && Array.isArray(overrides[locale].months)) {
    return overrides[locale].months;
  }
  return builtinMonths[locale] || builtinMonths.en;
};

export const getWeekdayNames = (locale, overrides) => {
  if (overrides && overrides[locale] && Array.isArray(overrides[locale].weekdays)) {
    return overrides[locale].weekdays;
  }
  return builtinWeekdays[locale] || builtinWeekdays.en;
};

