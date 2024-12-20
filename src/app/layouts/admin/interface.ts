import type { EIcon } from '@/enums';
import type { KEY_ROLE } from '@/utils';

/**
 * Represents a menu item in the admin layout.
 */
export interface IMenu {
  key?: string;
  label?: string;
  icon?: EIcon;
  permission?: KEY_ROLE;
  queryparams?: any;
  children?: IMenu[];
}
