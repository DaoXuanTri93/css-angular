import type { EStatusState } from '@/enums';
import type { IResponses } from '@/interfaces';
/**
 * Represents the state of a Local operation.
 * @template T - The type of data being operated on.
 */
interface LocalState<T = object> {
  isLoading?: boolean;
  status?: EStatusState;
  result?: IResponses<T[]>;
  data?: T;
  isVisible?: boolean;
}
export default LocalState;
