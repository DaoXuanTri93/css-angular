import type { EStatusState } from '@/enums';
import type { IResponses } from '@/interfaces';
/**
 * Represents the state of a Local operation.
 * @template T - The type of data being operated on.
 */
interface LocalTypeState<Y = object> {
  isLoadingType?: boolean;
  statusType?: EStatusState;
  resultType?: IResponses<Y[]>;
  dataType?: Y;
  isVisibleType?: boolean;
}
export default LocalTypeState;
