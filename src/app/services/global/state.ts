import type { en_US, ja_JP, vi_VN } from 'ng-zorro-antd/i18n';

import { EStatusState } from '@/enums';
import type { enLocale, viLocale } from '@/utils/locale';
import type State from './base/interface';

/**
 * Represents the global state of the application.
 */
export interface StateGlobal extends State {
  language?: string;
  locale?: typeof vi_VN | typeof en_US | typeof ja_JP;
  localeDate?: typeof enLocale | typeof viLocale;
  isCollapseMenu?: boolean;
}

/**
 * Represents the initial state for the global module.
 */
export const initialState: StateGlobal = {
  isLoading: false,
  status: EStatusState.Idle,
  isCollapseMenu: false,
  language: '',
  user: {},
};
