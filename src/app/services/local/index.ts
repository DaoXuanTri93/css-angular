import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { RBase } from './base';
import { initialState, type StateLocal } from './state';
import { RType } from './type';

export const SLocal = <T, Y = object>(keyApi?: string, keyApiType?: string) => {
  return signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods(store => ({
      set(value: StateLocal) {
        patchState(store, value);
      },
      reset() {
        patchState(store, initialState);
      },
    })),
    RBase<T>(keyApi),
    RType<Y>(keyApiType),
  );
};
