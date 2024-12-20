import { TFunction } from '@/utils/angular';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, input, ViewEncapsulation, type OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import type { ColumnPinningState, Header } from '@tanstack/angular-table';
import type { VirtualItem } from '@tanstack/angular-virtual';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: '[DropdownHeader]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule, NzDropDownModule],
  template: `<nz-dropdown-menu #renderDropdownItem="nzDropdownMenu">
    <ul nz-menu>
      <li nz-menu-item>
        <button>{{ t.instant('Hide') }}</button>
      </li>
      <li nz-menu-item>
        <button>{{ t.instant('PinLeft') }}</button>
      </li>
      <li nz-menu-item>
        <button>{{ t.instant('PinRight') }}</button>
      </li>
      <li nz-menu-item>
        <button>{{ t.instant('ResetSize') }}</button>
      </li>
      <li nz-menu-item>
        <button>{{ t.instant('ResetPin') }}</button>
      </li>
    </ul>
  </nz-dropdown-menu>`,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class DropdownHeader implements OnInit {
  readonly table = input.required<any>();
  readonly columnVirtualizer = input.required<any>();
  readonly columnPinning = input<ColumnPinningState>();
  readonly state = input.required<any>();
  readonly header = input.required<Header<any, unknown>>();
  readonly vc = input.required<VirtualItem>();
  readonly isRightClickHeader = input<boolean>();

  constructor(@Inject(TranslateService) public t: TFunction) {
    this.t.prefix = 'Components';
  }

  ngOnInit(): void {}
}
