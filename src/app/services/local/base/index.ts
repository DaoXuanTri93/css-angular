import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';

import { EStatusState } from '@/enums';
import type { IPaginationQuery } from '@/interfaces';
import { API, C_API } from '@/utils';
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
 * Represents a class for performing a GET request.
 * @class
 * @extends RReducer
 */
class Get extends RReducer {
  public constructor() {
    super();
    this.action = async ({
      params,
      keyApi,
      format,
    }: {
      params: IPaginationQuery;
      keyApi: string;
      format: (item: any, index: number) => void;
    }) => {
      const result = await API.get({ url: C_API[keyApi], params });
      if (format) result.data = (result.data as any).map(format);
      return result;
    };
    this.pending = (state, value) => {
      patchState(state, { data: value });
    };
    this.fulfilled = (state, data) => {
      console.log('result', data);
      patchState(state, { result: data ?? {} });
    };
  }
}

/**
 * Represents a class that handles the retrieval of data by ID.
 * @class
 * @extends RReducer
 */
class GetId extends RReducer {
  public constructor() {
    super();
    this.action = async ({
      id,
      params,
      keyApi,
    }: {
      id: string;
      params?: IPaginationQuery;
      keyApi: string;
      data: any;
    }) => {
      const { data } = await API.get({ url: `${C_API[keyApi]}/${id}`, params });
      return data;
    };
    this.fulfilled = (state, data) => {
      patchState(state, { data: data, isVisible: true });
    };
  }
}

/**
 * Represents a Post reducer class.
 * @class
 * @extends RReducer
 */
class Post extends RReducer {
  public constructor() {
    super();
    this.action = async ({ values, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.post({ url: `${C_API[keyApi]}`, values });
      return data;
    };
    this.pending = (state, value) => {
      patchState(state, { data: value.values });
    };
    this.fulfilled = state => {
      patchState(state, { status: EStatusState.IsFulfilled, isVisible: false });
    };
  }
}

/**
 * Represents a class for handling the PUT operation in a reducer.
 * @class
 * @extends RReducer
 */
class Put extends RReducer {
  public constructor() {
    super();
    this.action = async ({ values: { id, ...values }, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.put({ url: `${C_API[keyApi]}/${id}`, values });
      return data;
    };
    this.pending = (state, value) => {
      patchState(state, { data: value.values });
    };
    this.fulfilled = state => {
      patchState(state, { status: EStatusState.IsFulfilled, isVisible: false });
    };
  }
}

/**
 * Represents a class for deleting data using a reducer.
 * @class
 * @extends RReducer
 */
class Delete extends RReducer {
  public constructor() {
    super();
    this.action = async ({ id, keyApi }: { id: string; keyApi: string }) => {
      const { data } = await API.delete({ url: `${C_API[keyApi]}/${id}` });
      return data;
    };
    this.fulfilled = state => {
      patchState(state, { status: EStatusState.IsFulfilled });
    };
  }
}

export const RBase = <T = object>(keyApi?: string) =>
  signalStoreFeature(
    { state: type<State>() },
    withMethods(state => ({
      get(params?: IPaginationQuery<T>, format?: (item: T, index: number) => void) {
        new Get().reducer(state, { params: params as IPaginationQuery, keyApi, format });
      },
      getById({ id, params, data }: { id: string; params?: IPaginationQuery<T>; data: T }) {
        new GetId().reducer(state, { id, params: params as IPaginationQuery, keyApi, data });
      },
      post(values: T) {
        new Post().reducer(state, { values: values, keyApi });
      },
      put(values: T) {
        new Put().reducer(state, { values: values, keyApi });
      },
      delete(id: string) {
        new Delete().reducer(state, { id, keyApi });
      },
    })),
  );
