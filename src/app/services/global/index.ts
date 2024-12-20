import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { checkLanguage } from '@/utils';
import { RGlobal } from './base';
import { initialState, type StateGlobal } from './state';

export const SGlobal = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    set(value: StateGlobal) {
      patchState(store, value);
    },
    setLanguage(value: string) {
      if (value !== store.language?.()) {
        const payload = checkLanguage(value);
        patchState(store, payload);
      }
    },
  })),
  RGlobal(),
);
