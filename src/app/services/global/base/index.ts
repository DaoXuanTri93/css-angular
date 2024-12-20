import { EStatusState } from '@/enums';
import type { IMUser } from '@/interfaces/model';
import { API, C_API, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER } from '@/utils';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import type State from './interface';

class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = async (state: any, value) => {
      patchState(state, { isLoading: true, status: EStatusState.Idle });
      this.pending(state, value);
      try {
        const res = await this.action(value);
        patchState(state, { isLoading: false });
        this.fulfilled(state, res);
      } catch (e) {
        patchState(state, { isLoading: false });
        this.rejected(state, e);
      }
    };
  }
}
/**
 * Represents a class for handling login functionality.
 * @class
 */
class PostLogin extends RReducer {
  public constructor() {
    super();
    this.action = async (values: { password: string; username: string }) => {
      const { data } = await API.post<{ user: IMUser; access_token: string; refreshToken: string }>({
        url: `${C_API.Auth}/login`,
        values,
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.access_token);
        // localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
        localStorage.setItem(KEY_USER, JSON.stringify(data));
      }
      return data!.user;
    };

    this.pending = (state, value) => {
      patchState(state, { data: value });
    };
    this.fulfilled = (state, data) => {
      patchState(state, { user: data ?? {}, data: undefined, status: EStatusState.IsFulfilled });
    };
  }
}
export const RGlobal = () =>
  signalStoreFeature(
    { state: type<State>() },
    withMethods(state => ({
      async postLogin(values: { password: string; email: string }) {
        new PostLogin().reducer(state, values);
      },
    })),
  );
