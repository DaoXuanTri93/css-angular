import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Inject,
  input,
  output,
  signal,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  createAngularTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type FilterFn,
  type Table,
  type TableOptions,
} from '@tanstack/angular-table';
import { defaultRangeExtractor, injectVirtualizer, type Virtualizer } from '@tanstack/angular-virtual';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { EIcon } from '@/enums';
import { generateRangeNumber } from '@/utils';
import { TFunction } from '@/utils/angular';
import { generateOption } from '../util';
import { Header } from './header';

@Component({
  selector: '[Tanstack]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule, NzDropDownModule, Header],
  template: `<ng-container [ngTemplateOutlet]="firstItem() ?? null"></ng-container>
    <table class="c-virtual-scroll" [ngClass]="{ virtualized: this.isVirtualized() }" [ngStyle]="columnSizeVars()">
      <thead
        Header
        [table]="table"
        [isVirtualized]="isVirtualized()"
        [refVirtualPaddingLeft]="refVirtualPaddingLeft"
        [virtualColumns]="virtualColumns()"
        [refHeaderGroups]="refHeaderGroups"
        [state]="state"
        [columnVirtualizer]="columnVirtualizer"
        [columnPinning]="columnPinning()"
        [isRightClickHeader]="isRightClickHeader()"
        [getCommonPinningStyles]="getCommonPinningStyles"
        [isResizing]="isResizing()"
      ></thead>
    </table>`,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class Tanstack {
  EIcon = EIcon;

  readonly data = input.required<any[]>();
  readonly columns = input.required<ColumnDef<any>[]>();
  readonly columnPinning = input<ColumnPinningState>();
  readonly filterGlobal = input<FilterFn<any>>();
  readonly style = input<CSSStyleValue>();
  readonly paginationDescription = input(
    (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  );
  readonly firstItem = input<TemplateRef<unknown>>();

  readonly maxSize = input<number>(1200);
  readonly widthCell = input<number>(28);
  readonly heightCell = input<number>(28);
  readonly pageSize = input<number>();

  readonly isExpanded = input<boolean>();
  readonly isResizing = input<boolean>();
  readonly isPagination = input<boolean>();
  readonly isVirtualized = input<boolean>();
  readonly isRightClickHeader = input<boolean>();
  readonly isFilter = input<boolean>();

  readonly keyId = input<string>('id');
  readonly className = input<string>();
  readonly currentId = input<string>();
  readonly onRow = input<{
    onDoubleClick?: () => void;
    onClick?: () => void;
  }>();
  readonly rowSelection = input<{
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  }>();
  readonly onScroll =
    input<
      (props: {
        event: any;
        table: Table<any>;
        columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
        rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
      }) => void
    >();

  readonly onExpand = output<any>();
  readonly onChange = output<any>();

  readonly state = signal({
    globalFilter: '',
    columnFilters: [],
    sorting: [],
    columnVisibility: {},
    rowSelection: {},
    expanded: {},
    pagination: {
      pageIndex: 0,
      pageSize: this.pageSize() ?? 0,
    },
    columnPinning: this.columnPinning() ?? {},
  });

  option: TableOptions<any> = generateOption<any>({
    data: this.data(),
    widthCell: this.widthCell(),
    maxSize: this.maxSize(),
    columns: this.columns(),
    isResizing: this.isResizing(),
    isExpanded: this.isExpanded(),
    isPagination: this.isPagination(),
    isFilter: this.isFilter(),
    filterGlobal: this.filterGlobal(),
    rowSelection: this.rowSelection(),
    keyId: this.keyId(),
    state: this.state(),
  });
  table = createAngularTable(() => this.option);
  constructor(
    @Inject(ElementRef) private readonly refParent: ElementRef<HTMLDivElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {
    this.t.prefix = 'Components';
    // watch(
    //   () => [state.value],
    //   () => {
    //     onChange?.(table);
    //   },
    //   { immediate: true },
    // );
    // watch(
    //   () => [state.value.rowSelection],
    //   () => {
    //     if (rowSelection?.onChange) {
    //       rowSelection.onChange(
    //         Object.keys(state.value.rowSelection)
    //           ?.filter(key => !!state.value.rowSelection[key])
    //           ?.map(id => loopSelection({ id, array: data })),
    //       );
    //     }
    //   },
    //   { immediate: true },
    // );
  }
  loopSelection = ({ id, array }) => {
    let data;
    array.forEach(element => {
      if (!data && element[this.keyId()] === id) {
        data = element;
      } else if (!data && element.children) {
        data = this.loopSelection({ id, array: element.children });
      }
    });
    return data;
  };
  /**
   * Virtualizes the rows in the grid component.
   *
   * @remarks
   * This virtualizer is responsible for rendering a subset of rows based on the visible area of the grid.
   *
   * @param count - The total number of rows in the grid.
   * @param getScrollElement - A function that returns the scroll element of the grid.
   * @param estimateSize - A function that estimates the size of each row.
   * @param overscan - The number of additional rows to render outside the visible area.
   *
   * @returns The virtualizer object for the rows in the grid.
   */
  rowVirtualizer = injectVirtualizer(() => ({
    enabled: this.isVirtualized(),
    count: this.table.getRowModel().rows?.length ?? 0,
    scrollElement: this.refParent,
    estimateSize: () => this.heightCell(),
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 0,
  }));

  /**
   * Retrieves the virtual items for the grid.
   *
   * @returns An array of virtual items for the grid.
   */
  visibleColumns = this.table.getVisibleLeafColumns();
  totalSize = computed(() => this.table.getTotalSize());

  /**
   * Initializes the column virtualizer for the grid.
   *
   * @param {Object} options - The options for the column virtualizer.
   * @param {boolean} options.horizontal - Specifies if the virtualizer is horizontal.
   * @param {number} options.count - The number of columns in the virtualizer.
   * @param {Function} options.getScrollElement - A function that returns the scroll element.
   * @param {Function} options.estimateSize - A function that estimates the size of a column.
   * @param {number} options.overscan - The number of additional columns to render outside the visible area.
   */
  columnVirtualizer = injectVirtualizer(() => ({
    enabled: this.isVirtualized(),
    horizontal: true,
    count: this.visibleColumns.length,
    scrollElement: this.refParent,
    estimateSize: index => this.visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().width
        : undefined,
    overscan: 0,
    rangeExtractor: range => {
      const { columnPinning } = this.state();
      const data: any = [
        ...generateRangeNumber({
          start: columnPinning.left?.length ? 0 : undefined,
          end: columnPinning.left?.length && columnPinning.left?.length - 1,
        }),
        ...defaultRangeExtractor(range),
        ...generateRangeNumber({
          start: this.table.getVisibleLeafColumns().length - (columnPinning.right ?? []).length,
          end: columnPinning.right?.length ? this.table.getVisibleLeafColumns().length - 1 : undefined,
        }),
      ]
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort((a, b) => a - b);
      return data;
    },
  }));
  /**
   * Retrieves the virtualized columns for the grid.
   *
   * @returns An array of virtualized column items.
   */
  virtualColumns = computed(() => this.columnVirtualizer.getVirtualItems());

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  columnSizeVars = computed(() => {
    const headers = this.table.getFlatHeaders();
    const colSizes: { [key: string]: number | string } = {
      width: this.totalSize() + 'px',
    };
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  });

  //These are the important styles to make sticky column pinning work!
  //Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
  //View the index.css file for more needed styles such as border-collapse: separate
  getCommonPinningStyles = (column: Column<any>, id: string): any => {
    if (!column) return {};
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');
    const styleRight = isFirstRightPinnedColumn ? '4px 0 4px -4px gray inset' : undefined;
    return {
      boxShadow: isLastLeftPinnedColumn ? '-4px 0 4px -4px gray inset' : styleRight,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? 1 : 0,
      paddingRight: column?.columnDef?.meta?.filter ? '1.5rem' : undefined,
      width: `calc(var(--header-${id}-size) * 1px)`,
    };
  };

  refHeaderGroups = this.table.getHeaderGroups();
  // watch(
  //   () => [columns, data],
  //   () => {
  //     table.setOptions({ ...table.options, columns, data });
  //     if (table.options.columns !== columns) {
  //       refHeaderGroups.value = table.getHeaderGroups();
  //     }
  //   },
  //   { immediate: true },
  // );

  //   const refResize = ref();
  // const refTimeOut = ref<ReturnType<typeof setTimeout>>();
  // watch(refResize, () => {
  //   if (refResize.value.isResizing) {
  //     clearTimeout(refTimeOut.value);
  //     refTimeOut.value = setTimeout(() => {
  //       columnVirtualizer.value.resizeItem(refResize.value.vc, refResize.value.header.column.getSize());
  //     }, 200);
  //   }
  // });
  // const renderArrowVisibility = ({ vc, index, right = false }) => {
  //   let indexVisibility = 0;
  //   const visibility = refHeaderGroups.value.map(headerGroup =>
  //     headerGroup.headers
  //       .map((header, index) => {
  //         if (state.value.columnVisibility[header.id] === false) {
  //           indexVisibility += 1;
  //           return {
  //             id: header.id,
  //             index: index - (indexVisibility - 1),
  //           };
  //         }
  //         return null;
  //       })
  //       .filter((item: any) => item),
  //   );
  //   const arrowLeft: any = visibility[index].find((item: any) => item.index === vc.index);
  //   const arrowRight: any = visibility[index].find((item: any) => item.index === vc.index + 1);

  //   return (
  //     ((!!arrowLeft && !right) || (!!arrowRight && right)) && (
  //       <button
  //         onClick={() =>
  //           table.setColumnVisibility({
  //             ...state.value.columnVisibility,
  //             [arrowLeft?.id || arrowRight?.id]: true,
  //           })
  //         }
  //         class={[
  //           'absolute top-1/2 h-2 -translate-y-1/2 transform cursor-zoom-in',
  //           {
  //             'left-0': arrowLeft && !right,
  //             'right-0.5': arrowRight && right,
  //           },
  //         ]}
  //       >
  //         <CSvgIcon name={EIcon.Arrow} size={8} class={[{ 'rotate-180': arrowLeft && !right }]} />
  //       </button>
  //     )
  //   );
  // };
  refVirtualPaddingLeft;
  generateArray = array => {
    return array;
  };
}
