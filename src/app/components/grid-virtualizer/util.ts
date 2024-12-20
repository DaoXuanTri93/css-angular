import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type TableOptions,
} from '@tanstack/angular-table';
import { isAfter, isBefore, isSameDay } from 'date-fns';

export enum ETypeFilter {
  IncludeText = 'includeText',
  NotIncludeText = 'notIncludeText',
  StartText = 'startText',
  EndText = 'endText',
  SameText = 'sameText',
  SameDate = 'sameDate',
  BeforeDate = 'beforeDate',
  AfterDate = 'afterDate',
  GreaterNumber = 'greaterNumber',
  GreaterEqualNumber = 'greaterEqualNumber',
  LessNumber = 'lessNumber',
  LessEqualNumber = 'lessEqualNumber',
  EqualNumber = 'equalNumber',
  NotEqualNumber = 'notEqualNumber',
  MiddleNumber = 'middleNumber',
  NotMiddleNumber = 'notMiddleNumber',
  Blank = 'blank',
  NotBlank = 'notBlank',
}
/**
 * Calculates the number of pages based on the height of the document body.
 *
 * @param height - The height of each page in pixels. Default is 39.
 * @param minusNumber - The number to subtract from the calculated page count. Default is 2.
 * @returns The number of pages based on the height of the document body.
 */
export const getSizePageByHeight = ({
  height = 28,
  minusNumber = 4,
  element = document.getElementsByTagName('tbody')[0],
}: any) =>
  Math.floor((document.body.getBoundingClientRect().height - element.getBoundingClientRect().top) / height) -
  minusNumber;

export const generateOption = <TData>({
  data,
  widthCell,
  maxSize,
  columns,
  isResizing,
  isExpanded,
  isPagination,
  isFilter,
  filterGlobal,
  rowSelection,
  keyId = 'id',
  state,
}) => {
  console.log(data);
  const option: TableOptions<TData> = {
    filterFns: {
      //define as a filter function that can be used in column definitions
      global: (row, columnId, value, addMeta) => !filterGlobal || filterGlobal(row, columnId, value, addMeta),
      blank: (row, columnId) =>
        (typeof row.original[columnId] === 'number' && row.original[columnId] === null) ||
        (typeof row.original[columnId] === 'string' && row.original[columnId]?.trim().length === 0),
      notBlank: (row, columnId) =>
        (typeof row.original[columnId] === 'number' && row.original[columnId] !== null) ||
        (typeof row.original[columnId] === 'string' && row.original[columnId]?.trim().length > 0),
      includeText: (row, columnId, value) => !value || row.original[columnId].includes(value),
      notIncludeText: (row, columnId, value) => !value || !row.original[columnId].includes(value),
      startText: (row, columnId, value) => !value || row.original[columnId].startsWith(value),
      endText: (row, columnId, value) => !value || row.original[columnId].endsWith(value),
      sameText: (row, columnId, value) => !value || row.original[columnId] === value,
      sameDate: (row, columnId, value) =>
        !value || !row.original[columnId] || isSameDay(new Date(value), new Date(row.original[columnId])),
      beforeDate: (row, columnId, value) =>
        !value || !row.original[columnId] || isBefore(new Date(row.original[columnId]), new Date(value)),
      afterDate: (row, columnId, value) =>
        !value || !row.original[columnId] || isAfter(new Date(row.original[columnId]), new Date(value)),
      greaterNumber: (row, columnId, value) => value === undefined || row.original[columnId] > parseFloat(value),
      greaterEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] >= parseFloat(value),
      lessNumber: (row, columnId, value) => value === undefined || row.original[columnId] < parseFloat(value),
      lessEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] <= parseFloat(value),
      equalNumber: (row, columnId, value) => value === undefined || row.original[columnId] === parseFloat(value),
      notEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] !== parseFloat(value),
      middleNumber: (row, columnId, value) =>
        !value ||
        value.length !== 2 ||
        (row.original[columnId] >= parseFloat(value[0]) && row.original[columnId] <= parseFloat(value[1])),
      notMiddleNumber: (row, columnId, value) =>
        !value ||
        value.length !== 2 ||
        row.original[columnId] < parseFloat(value[0]) ||
        row.original[columnId] > parseFloat(value[1]),
    },
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: state.value,
    onColumnVisibilityChange: updaterOrValue =>
      (state.value.columnVisibility =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.columnVisibility) : updaterOrValue),
    globalFilterFn: 'global',
    enableColumnFilters: isFilter,
    getRowId: (row: any) => row[keyId],
    onColumnPinningChange: updaterOrValue => {
      state.value.columnPinning =
        updaterOrValue instanceof Function ? updaterOrValue(state.value.columnPinning) : updaterOrValue;
    },
  };

  if (isFilter && option.state) {
    option.onColumnFiltersChange = updaterOrValue =>
      (state.value.columnFilters =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.columnFilters) : updaterOrValue);
    option.onGlobalFilterChange = updaterOrValue =>
      (state.value.globalFilter =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.globalFilter) : updaterOrValue);
    option.getFilteredRowModel = getFilteredRowModel(); //client-side filtering
    option.getFacetedRowModel = getFacetedRowModel(); // client-side faceting
    option.getFacetedUniqueValues = getFacetedUniqueValues(); // generate unique values for select filter/autocomplete
    option.getFacetedMinMaxValues = getFacetedMinMaxValues(); // generate min/max values for range filter
  }

  if (isResizing) {
    option.columnResizeMode = 'onChange';
    option.defaultColumn = {
      minSize: widthCell,
      maxSize,
    };
  }

  if (isPagination && option.state) {
    option.onPaginationChange = updaterOrValue =>
      (state.value.pagination =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.pagination) : updaterOrValue);
    option.getPaginationRowModel = getPaginationRowModel();
  }

  if (rowSelection && option.state) {
    option.onRowSelectionChange = updaterOrValue =>
      (state.value.rowSelection =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.rowSelection) : updaterOrValue);
    option.enableRowSelection = true;
    //option.enableRowSelection = row => row.original.age > 18, // or enable row selection conditionally per row
  }

  if (isExpanded && option.state) {
    option.getSubRows = (row: any) => row.children;
    option.onExpandedChange = updaterOrValue =>
      (state.value.expanded =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.expanded) : updaterOrValue);
    option.getExpandedRowModel = getExpandedRowModel();
    if (isFilter) option.filterFromLeafRows = true;
    if (isPagination) option.paginateExpandedRows = false;
  }

  return isSort({ option, columns, state });
};
const isSort = ({ option, columns, state }) => {
  const isSorter = columns.length && columns.some(obj => obj.meta && Object.keys(obj.meta).includes('sorter'));
  if (isSorter && option.state) {
    option.onSortingChange = updaterOrValue =>
      (state.value.sorting =
        typeof updaterOrValue === 'function' ? updaterOrValue(state.value.sorting) : updaterOrValue);
    option.getSortedRowModel = getSortedRowModel();
  }
  return option;
};

export const getPaddingLeft = ({ old, virtualColumns, pinLeft }) => {
  if (virtualColumns?.length) {
    const isPinLeft = pinLeft.length > 0 && virtualColumns[pinLeft.length].index != pinLeft.length;
    const virtualPaddingLeft =
      virtualColumns[isPinLeft ? pinLeft.length : 0]?.start - (isPinLeft ? virtualColumns[pinLeft.length - 1]?.end : 0);
    if (old !== virtualPaddingLeft) return virtualPaddingLeft;
  }
  return old;
};
