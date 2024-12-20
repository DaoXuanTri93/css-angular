import {
  type CreateEffectOptions,
  type EffectCleanupRegisterFn,
  type EffectRef,
  Injectable,
  effect,
  untracked,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';

@Injectable()
export class TFunction extends TranslateService {
  prefix = '';

  public override get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return super.get(this.prefix + '.' + key, interpolateParams);
  }

  public override instant(key: string | Array<string>, interpolateParams?: Object): string {
    return super.instant(this.prefix + '.' + key, interpolateParams);
  }
}

/**
 * We want to have the Tuple in order to use the types in the function signature
 */
type ExplicitEffectValues<T> = {
  [K in keyof T]: () => T[K];
};

/**
 * Extend the regular set of effect options
 */
declare interface CreateExplicitEffectOptions extends CreateEffectOptions {
  /**
   * Option that allows the computation not to execute immediately, but only run on first change.
   */
  defer?: boolean;
}

/**
 * @param deps - The dependencies that the effect will run on
 * @param fn - The function to run when the dependencies change
 * @param options - The options for the effect with the addition of defer (it allows the computation to run on first change, not immediately)
 */
export function explicitEffect<Input extends readonly unknown[], Params = Input>(
  deps: readonly [...ExplicitEffectValues<Input>],
  fn: (deps: Params, onCleanup: EffectCleanupRegisterFn) => void,
  options?: CreateExplicitEffectOptions | undefined,
): EffectRef {
  let defer = options?.defer;
  return effect(onCleanup => {
    const depValues = deps.map(s => s());
    untracked(() => {
      if (!defer) {
        fn(depValues as any, onCleanup);
      }
      defer = false;
    });
  }, options);
}
