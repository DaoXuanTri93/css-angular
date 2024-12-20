import { EIcon } from '@/enums';
import type { ITableGet, ITableItemFilterList } from '@/interfaces';
import { API, arrayUnique, C_API, KEY_DATA } from '@/utils';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  Inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '[CESelect]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, NzSelectModule],
  template: `
    <nz-select
      [class]="className()"
      [nzMaxTagCount]="maxTagCount()"
      [nzPlaceHolder]="placeholder()"
      [ngModel]="valueCurrent()"
      [nzDisabled]="disabled()"
      [nzShowSearch]="showSearch()"
      [nzLoading]="state().isLoading"
      [nzAllowClear]="allowClear()"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      [nzMode]="isMultiple() ? 'multiple' : 'default'"
      (nzOnSearch)="showSearch() && loadData($event)"
      (ngModelChange)="onChange.emit($event)"
      (nzBlur)="onBlur.emit($event)"
      (nzOpenChange)="!!$event && state().isLoading && loadData('')"
    >
      @for (item of options(); track item.value) {
        <nz-option [nzLabel]="item.label" [nzValue]="item.value"></nz-option>
      }
    </nz-select>
    <ng-template #tagPlaceHolder let-array>+{{ array.length }}</ng-template>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CESelect {
  EIcon = EIcon;
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly showSearch = input<boolean>();
  readonly maxTagCount = input<number>(0);
  readonly className = input<string>('');
  readonly get = input<ITableGet>();
  readonly list = input<ITableItemFilterList[]>();
  readonly isMultiple = input<boolean>();
  readonly allowClear = input<boolean>();

  readonly onBlur = output<any>();
  readonly onChange = output<Event>();

  readonly state = signal<{ current: ITableItemFilterList[]; list: ITableItemFilterList[]; isLoading: boolean }>({
    current: [],
    list: [],
    isLoading: false,
  });

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {
    effect(
      () => {
        /**
         * Represents an array of data.
         */
        let current: any = [];
        if (this.get()?.data() && this.get()?.format) {
          current = this.isMultiple()
            ? this.get()?.data().map(this.get()?.format)
            : [this.get()?.format?.(this.get()?.data())];
        }
        this.state.set({
          current,
          list: !this.get()?.keyApi
            ? this.list()
            : JSON.parse(localStorage.getItem(KEY_DATA[this.get()?.keyApi ?? '']) ?? '{}')
                .data.filter(item => !item.isDelete)
                .map((e: any) => (this.get()?.format ? this.get()?.format?.(e) : e)),
          isLoading: false,
        });
      },
      { allowSignalWrites: true },
    );
  }

  options = computed(() => arrayUnique([...this.state().current, ...this.state().list], 'value'));
  valueCurrent = computed(() => this.value() ?? (this.isMultiple() ? [] : ''));
  /**
   * Loads data for the select input.
   *
   * @param fullTextSearch - The full text search string.
   */
  loadData = async (fullTextSearch: string) => {
    if (this.get()?.keyApi) {
      const params = { latestUpdated: '' };
      const local = JSON.parse(localStorage.getItem(KEY_DATA[this.get()?.keyApi ?? '']) ?? '{}');
      if (!local.isLatest)
        try {
          this.state.update(old => ({ ...old, isLoading: true }));
          params.latestUpdated = local.data?.[0]?.updatedAt;

          const result = await API.get<any>({ url: `${C_API[this.get()?.keyApi ?? '']}`, params });
          local.data = [...result.data, ...local.data];
          localStorage.setItem(
            KEY_DATA[this.get()?.keyApi ?? ''],
            JSON.stringify({ data: local.data, isLatest: true }),
          );
        } catch (e) {
          console.log(e);
        }
      this.state.update(old => ({
        ...old,
        list: local.data
          .map((e: any) => (this.get()?.format ? this.get()?.format?.(e) : e))
          .filter(
            (item: any) =>
              !item.isDelete &&
              !!item.value &&
              !!item.label &&
              item.label.toUpperCase()?.indexOf?.(fullTextSearch.toUpperCase()) > -1,
          ),
        isLoading: false,
      }));
    } else if (this.list()) {
      this.state.update(old => ({
        ...old,
        list:
          this.list()?.filter(
            (item: any) =>
              !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
          ) ?? [],
      }));
    }
  };
}
