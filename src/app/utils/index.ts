import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import ja from '@angular/common/locales/ja';
import vi from '@angular/common/locales/vi';
import { en_US, ja_JP, vi_VN } from 'ng-zorro-antd/i18n';

import { format, isValid } from 'date-fns';
import { enLocale, jaLocale, viLocale } from './locale';
import { FORMAT_DATE, KEY_USER } from './variable';

export * from './api';
export * from './variable';

/**
 * Sorts two objects based on a specified property.
 * @param {Object} options - The options for sorting.
 * @param {any} options.left - The left object to compare.
 * @param {any} options.right - The right object to compare.
 * @param {string} [options.name] - The name of the property to compare. (optional)
 * @returns {number} - Returns -1 if left is less than right, 1 if left is greater than right, or 0 if they are equal.
 */
export const sortObject = ({ left, right, name }: { left: any; right: any; name?: string }) => {
  if (name !== undefined) {
    if (left[name] < right[name]) return -1;
    else if (left[name] > right[name]) return 1;
  }
  return 0;
};

/**
 * Checks the language and sets the locale and localeDate accordingly.
 * @param language - The language to be checked.
 * @returns An object containing the language, locale, and localeDate.
 */
export const checkLanguage = (language: string) => {
  let locale;
  let localeDate;
  switch (language) {
    case 'en':
      locale = en_US;
      localeDate = enLocale;
      registerLocaleData(en);
      break;
    case 'vi':
      locale = vi_VN;
      localeDate = viLocale;
      registerLocaleData(vi);
      break;
    case 'ja':
      locale = ja_JP;
      localeDate = jaLocale;
      registerLocaleData(ja);
      break;
  }
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  const user = JSON.parse(localStorage.getItem(KEY_USER) ?? '{}');
  return { language, locale, localeDate, user };
};

/**
 * Formats a given date string into the specified format using Day.js.
 *
 * @param {string} dateString - The date string to be formatted.
 * @param {string} [format=FORMAT_DATE] - The format string to use for formatting the date.
 * @returns {string} The formatted date string.
 * @throws {Error} If the provided date string is invalid.
 */
export function formatDateTime(dateString: string, formatDate: string = FORMAT_DATE): string {
  /**
   * Creates a Day.js date object from the provided date string.
   *
   * @param {string} dateString - The date string to be parsed into a Day.js date object.
   * @returns {Dayjs} The Day.js date object representing the parsed date.
   */
  if (!isValid(new Date(dateString))) {
    return dateString;
  }

  return format(new Date(dateString), formatDate);
}
export const generateRangeNumber = ({ start, end, step = 1 }: { start?: number; end?: number; step?: number }) => {
  if (start !== undefined && end !== undefined) {
    const len = Math.floor((end - start) / step) + 1;
    return Array(len)
      .fill(undefined)
      .map((_, idx) => start + idx * step);
  }
  return [];
};

/**
 * Removes duplicate elements from an array.
 * If a key is provided, it checks for duplicates based on the value of the specified key.
 * If no key is provided, it checks for duplicates based on the entire object.
 *
 * @param array - The array to remove duplicates from.
 * @param key - The key to check for duplicates (optional).
 * @returns A new array with duplicate elements removed.
 */
export const arrayUnique = (array: any, key?: string) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if ((key && a[i][key] === a[j][key]) || JSON.stringify(a[i]) === JSON.stringify(a[j])) {
        a.splice(j, 1);
      }
    }
  }
  return a;
};
