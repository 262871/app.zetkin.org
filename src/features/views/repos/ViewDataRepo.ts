import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { Store } from 'core/store';
import {
  cellUpdate,
  cellUpdated,
  columnsLoad,
  columnsLoaded,
  rowAdded,
  rowRemoved,
  rowsLoad,
  rowsLoaded,
  viewLoad,
  viewLoaded,
  viewUpdate,
  viewUpdated,
} from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

export default class ViewDataRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  async addPersonToView(
    orgId: number,
    viewId: number,
    personId: number
  ): Promise<void> {
    const row = await this._apiClient.put<ZetkinViewRow>(
      `/api/orgs/${orgId}/people/views/${viewId}/rows/${personId}`
    );
    this._store.dispatch(rowAdded([viewId, row]));
  }

  clearCellData(orgId: number, viewId: number, rowId: number, colId: number) {
    this._store.dispatch(cellUpdate());
    this._apiClient
      .delete(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`
      )
      .then(() => {
        this._store.dispatch(cellUpdated([viewId, rowId, colId, null]));
      });
  }

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getColumns(orgId: number, viewId: number): IFuture<ZetkinViewColumn[]> {
    const state = this._store.getState();
    const list = state.views.columnsByViewId[viewId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => columnsLoad(viewId),
      actionOnSuccess: (columns) => columnsLoaded([viewId, columns]),
      loader: () =>
        this._apiClient.get(
          `/api/orgs/${orgId}/people/views/${viewId}/columns`
        ),
    });
  }

  getRows(orgId: number, viewId: number): IFuture<ZetkinViewRow[]> {
    const state = this._store.getState();
    const list = state.views.rowsByViewId[viewId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => rowsLoad(viewId),
      actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/rows`),
    });
  }

  getView(orgId: number, viewId: number): IFuture<ZetkinView> {
    const state = this._store.getState();
    const item = state.views.viewList.items.find((item) => item.id == viewId);
    return loadItemIfNecessary(item, this._store, {
      actionOnLoad: () => viewLoad(viewId),
      actionOnSuccess: (view) => viewLoaded(view),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
    });
  }

  async removeRows(
    orgId: number,
    viewId: number,
    rows: number[]
  ): Promise<void> {
    await this._apiClient.post(
      `/api/views/removeRows?orgId=${orgId}&viewId=${viewId}`,
      { rows }
    );

    rows.forEach((rowId) => this._store.dispatch(rowRemoved([viewId, rowId])));
  }

  setCellData<DataType>(
    orgId: number,
    viewId: number,
    rowId: number,
    colId: number,
    value: DataType
  ) {
    this._store.dispatch(cellUpdate());
    this._apiClient
      .put<{ value: DataType }>(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`,
        { value }
      )
      .then((data) => {
        this._store.dispatch(cellUpdated([viewId, rowId, colId, data.value]));
      });
  }

  updateView(
    orgId: number,
    viewId: number,
    data: ZetkinViewUpdateBody
  ): IFuture<ZetkinView> {
    const mutating = Object.keys(data);
    this._store.dispatch(viewUpdate([viewId, mutating]));
    const promise = this._apiClient
      .patch<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`, data)
      .then((view) => {
        this._store.dispatch(viewUpdated([view, mutating]));
        return view;
      });

    return new PromiseFuture(promise);
  }
}
