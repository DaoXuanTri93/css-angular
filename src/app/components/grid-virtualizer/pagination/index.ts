import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Inject,
  input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '[CPagination]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule, NzSelectModule, CSvgIcon],
  template: `<div class="p-left">
      <nz-select [(ngModel)]="perPage" nzAllowClear (ngModelChange)="onPageSizeChange($event)">
        @for (item of state().pageSizeOptions; track item) {
          <nz-option [nzValue]="item" [nzLabel]="item + ' / page'"></nz-option>
        }
      </nz-select>
      <div class="whitespace-nowrap">{{ paginationDescription()(state().ranges[0], state().ranges[1], total()) }}</div>
    </div>
    <div class="p-right">
      @for (item of state().listOfPageItem; track item) {
        <button
          type="button"
          [disabled]="item.disabled"
          [ngClass]="{ active: page() === item.index, disabled: item.disabled }"
          ariaLabel="{{ item.type }}"
        >
          <svg *ngIf="item.type === 'prev'" CSvgIcon [name]="EIcon.Arrow" class="rotate-180"></svg>
          <svg *ngIf="item.type === 'next'" CSvgIcon [name]="EIcon.Arrow"></svg>
          <svg *ngIf="item.type === 'prev_10'" CSvgIcon [name]="EIcon.DoubleArrow" class="rotate-180"></svg>
          <svg *ngIf="item.type === 'next_10'" CSvgIcon [name]="EIcon.DoubleArrow"></svg>
          <span *ngIf="item?.type?.indexOf('page') === 0">{{ item?.index }}</span>
          <span *ngIf="item?.type === 'prev_5' || item?.type === 'next_5'">...</span>
        </button>
      }
    </div> `,
  styleUrl: './index.less',
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CPagination {
  EIcon = EIcon;

  readonly total = input<number>(4);
  readonly page = input<number>(1);
  readonly perPage = input<number>(10);
  readonly table = input<any>();
  readonly paginationDescription = input(
    (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  );

  @Output() queryParams = new EventEmitter<{ perPage: number; page: number }>();

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {
    effect(
      () => {
        this.el.nativeElement.setAttribute('class', 'pagination');
        this.buildIndexes();
      },
      { allowSignalWrites: true },
    );
  }

  readonly state = signal<{
    pageSizeOptions: number[];
    /**
     * Represents a reference to a list of page items.
     *
     * @typedef {Object} ListOfPageItem
     * @property {boolean} disabled - Indicates if the page item is disabled.
     * @property {string} type - The type of the page item.
     * @property {number} index - The index of the page item.
     */
    listOfPageItem: { disabled: boolean; type: string; index: number }[];
    ranges: number[];
  }>({
    pageSizeOptions: [this.perPage(), this.perPage() * 2, this.perPage() * 3, this.perPage() * 4, this.perPage() * 5],
    listOfPageItem: [],
    ranges: [(this.page() - 1) * this.perPage() + 1, Math.min(this.page() * this.perPage(), this.total())],
  });

  /**
   * Calculates the last index based on the total number of items and the page size.
   *
   * @param total - The total number of items.
   * @param pageSize - The number of items per page.
   * @returns The last index.
   */
  getLastIndex = (total: number, pageSize: number) => {
    return Math.ceil(total / pageSize);
  };

  /**
   * Handles the change of page size.
   *
   * @param perPage - The number of items per page.
   */
  onPageSizeChange = size => {
    this.queryParams.emit({ perPage: size, page: this.page() });
    this.table().setPageSize(size);
    this.buildIndexes();
  };

  /**
   * Handles the change of the page index.
   *
   * @param {Object} options - The options for the page index change.
   * @param {string} options.type - The type of the page index change.
   * @param {number} options.index - The new index for the page.
   */
  onPageIndexChange = ({ type, index }: { type: string; index: number }) => {
    switch (type) {
      case 'prev':
        index = this.page() - 1;
        break;
      case 'prev_10':
        index = this.page() - 10;
        break;
      case 'next':
        index = this.page() + 1;
        break;
      case 'next_10':
        index = this.page() + 10;
        break;
      default:
    }
    this.queryParams.emit({ perPage: this.perPage(), page: index });
    this.table().setPageIndex(index - 1);
    this.buildIndexes();
  };

  /**
   * Generates a list of page items for pagination.
   *
   * @param pageIndex - The current page index.
   * @param lastIndex - The index of the last page.
   * @returns An array of page items with their index, type, and disabled status.
   */
  getListOfPageItem = (pageIndex: number, lastIndex: number) => {
    /**
     * Concatenates the given list of pages with previous and next items.
     *
     * @param listOfPage - The list of pages to concatenate.
     * @returns The concatenated list of pages with previous and next items.
     */
    const concatWithPrevNext = (listOfPage: { index: number; type: string; disabled: boolean }[]) => {
      /**
       * Represents the previous 10 item in the pagination.
       * @property {string} type - The type of the item ('prev_10').
       * @property {number} index - The index of the item (-1).
       * @property {boolean} disabled - Indicates if the item is disabled based on the current page.
       */
      const prev10Item = {
        type: 'prev_10',
        index: -1,
        disabled: this.page() - 10 < 0,
      };
      /**
       * Represents the previous item in the pagination.
       * @typedef {Object} PrevItem
       * @property {string} type - The type of the item (always 'prev').
       * @property {number} index - The index of the item (-1 for previous item).
       * @property {boolean} disabled - Indicates if the item is disabled (true if pageIndex is 1, false otherwise).
       */
      const prevItem = {
        type: 'prev',
        index: -1,
        disabled: pageIndex === 1,
      };
      /**
       * Represents the next item in the pagination.
       * @property {string} type - The type of the item (always 'next').
       * @property {number} index - The index of the item (-1 for the next item).
       * @property {boolean} disabled - Indicates whether the next item is disabled or not.
       */
      const nextItem = {
        type: 'next',
        index: -1,
        disabled: pageIndex === lastIndex,
      };
      /**
       * Represents the next 10 item in the pagination.
       * @property {string} type - The type of the item.
       * @property {number} index - The index of the item.
       * @property {boolean} disabled - Indicates if the item is disabled.
       */
      const next10Item = {
        type: 'next_10',
        index: -1,
        disabled: this.page() + 10 > lastIndex,
      };
      return [prev10Item, prevItem, ...listOfPage, nextItem, next10Item];
    };
    /**
     * Generates a list of pages with index, type, and disabled properties.
     *
     * @param start - The starting index of the page.
     * @param end - The ending index of the page.
     * @returns An array of objects representing the pages.
     */
    const generatePage = (start: number, end: number) => {
      const list: { index: number; type: string; disabled: boolean }[] = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page_' + i,
          disabled: false,
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      /**
       * Generates a range of items for pagination.
       *
       * @param selected - The currently selected item.
       * @param last - The last item in the range.
       * @returns An array of range items.
       */
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange: { index: number; type: string; disabled: boolean }[];
        /**
         * Represents the previous five item in the pagination.
         */
        const prevFiveItem = {
          type: 'prev_5',
          index: -1,
          disabled: false,
        };
        /**
         * Represents the next five item.
         * @type {Object}
         * @property {string} type - The type of the item ('next_5').
         * @property {number} index - The index of the item (-1).
         * @property {boolean} disabled - Indicates if the item is disabled (false).
         */
        const nextFiveItem = {
          type: 'next_5',
          index: -1,
          disabled: false,
        };
        /**
         * Generates the first page item.
         *
         * @param {number} pageNumber - The page number.
         * @param {number} totalPages - The total number of pages.
         * @returns {PageItem} The generated page item.
         */
        const firstPageItem = generatePage(1, 1);
        /**
         * Generates a page item for the last page.
         *
         * @param {number} lastIndex - The index of the last page.
         * @returns {PageItem} - The generated page item.
         */
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 4), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 1, selected + 1), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 3, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  };

  /**
   * Builds the indexes for pagination.
   *
   * This function calculates the last index, generates a list of page items, and updates the temporary state.
   * @returns void
   */
  buildIndexes = () => {
    const lastIndex = this.getLastIndex(this.total(), this.perPage());
    this.state.update(old => ({
      ...old,
      listOfPageItem: this.getListOfPageItem(this.page(), lastIndex),
      ranges: [(this.page() - 1) * this.perPage() + 1, Math.min(this.page() * this.perPage(), this.total())],
    }));
  };
}
