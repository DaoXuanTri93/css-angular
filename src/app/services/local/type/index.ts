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
    this.action = async ({ params, keyApiType }: { params: IPaginationQuery; keyApiType: string }) => {
      return await API.get({ url: C_API[keyApiType], params });
    };
    this.pending = (state, value) => {
      patchState(state, { dataType: value });
    };
    this.fulfilled = (state, data) => {
      patchState(state, { resultType: data ?? {} });
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
      keyApiType,
    }: {
      id: string;
      params?: IPaginationQuery;
      keyApiType: string;
      data: any;
    }) => {
      const { data } = await API.get({ url: `${C_API[keyApiType]}/${id}`, params });
      return data;
    };
    this.fulfilled = (state, data) => {
      patchState(state, { dataType: data, isVisibleType: true });
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
    this.action = async ({ values, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.post({ url: `${C_API[keyApiType]}`, values });
      return data;
    };
    this.pending = (state, value) => {
      patchState(state, { dataType: value.values });
    };
    this.fulfilled = state => {
      patchState(state, { statusType: EStatusState.IsFulfilled, isVisibleType: false });
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
    this.action = async ({ values: { id, ...values }, keyApiType }: { values: any; keyApiType: string }) => {
      const { data } = await API.put({ url: `${C_API[keyApiType]}/${id}`, values });
      return data;
    };
    this.pending = (state, value) => {
      patchState(state, { dataType: value.values });
    };
    this.fulfilled = state => {
      patchState(state, { statusType: EStatusState.IsFulfilled, isVisibleType: false });
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
    this.action = async ({ id, keyApiType }: { id: string; keyApiType: string }) => {
      const { data } = await API.delete({ url: `${C_API[keyApiType]}/${id}` });
      return data;
    };
    this.fulfilled = state => {
      patchState(state, { statusType: EStatusState.IsFulfilled });
    };
  }
}

export const RType = <T = object>(keyApiType?: string) =>
  signalStoreFeature(
    { state: type<State>() },
    withMethods(state => ({
      getType(params: IPaginationQuery<T>, format?: (item: T, index: number) => void) {
        new Get().reducer(state, { params: params as IPaginationQuery, keyApiType, format });
      },
      getByIdType({ id, params, data }: { id: string; params?: IPaginationQuery<T>; data: T }) {
        new GetId().reducer(state, { id, params: params as IPaginationQuery, keyApiType, data });
      },
      postType(values: T) {
        new Post().reducer(state, { values: values, keyApiType });
      },
      putType(values: T) {
        new Put().reducer(state, { values: values, keyApiType });
      },
      deleteType(id: string) {
        new Delete().reducer(state, { id, keyApiType });
      },
    })),
  );
