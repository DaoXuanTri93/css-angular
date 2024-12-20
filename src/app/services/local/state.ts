import { EStatusState } from '@/enums';
import type State from './base/interface';
import type StateType from './type/interface';

/**
 * Represents the state for Local operations with additional properties.
 *
 * @template T - The type of the object being manipulated.
 */
export interface StateLocal<T = object, Y = object> extends State<T>, StateType<Y> {}

/**
 * Initial state for the Local service.
 */
export const initialState: StateLocal = {
  result: undefined,
  data: undefined,
  isLoading: false,
  isVisible: false,
  status: EStatusState.Idle,

  resultType: undefined,
  dataType: undefined,
  isLoadingType: false,
  isVisibleType: false,
  statusType: EStatusState.Idle,
};
