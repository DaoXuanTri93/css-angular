import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services/global';
import { APP_NAME, KEY_ROLE, LINK } from '@/utils';
import { TFunction } from '@/utils/angular';
import { getState } from '@ngrx/signals';
import type { IMenu } from './interface';

@Component({
  selector: '[LayoutAdminSide]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CommonModule, NzMenuModule, NzToolTipModule, CSvgIcon],
  template: `
    <button class="logo" [ngClass]="{ active: sGlobal.isCollapseMenu?.() }" (click)="handleGoDashboard()">
      <svg CSvgIcon [name]="EIcon.Logo"></svg>
      <h1 [ngClass]="{ active: sGlobal.isCollapseMenu?.() }">{{ APP_NAME }}</h1>
    </button>
    <div className="scrollbar">
      <ul nz-menu nzMode="inline" [nzInlineCollapsed]="sGlobal.isCollapseMenu?.()">
        <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: listMenu() }"></ng-container>
        <ng-template #menuTpl let-menus>
          @for (menu of menus; track menu) {
            @if (!menu.children) {
              <li
                nz-menu-item
                [nzPaddingLeft]="menu.level * 24"
                [nzDisabled]="menu.disabled"
                [nzSelected]="'/' + sGlobal.language?.() + menu.key === router.url"
                (click)="onSelect(menu)"
                nz-tooltip
                nzTooltipPlacement="right"
                [nzTooltipTitle]="menu.level === 1 && sGlobal.isCollapseMenu?.() ? t.instant(menu.label) : ''"
              >
                @if (menu.icon) {
                  <svg class="ant-menu-item-icon" CSvgIcon [name]="menu.icon" [size]="24"></svg>
                }
                <span>{{ t.instant(menu.label) }}</span>
              </li>
            } @else {
              <li
                nz-submenu
                [nzPaddingLeft]="menu.level * 24"
                [nzOpen]="sGlobal.language?.() + menu.key === router.url.substring(1).split('/').slice(0, 2).join('/')"
                [nzDisabled]="menu.disabled"
                [nzTitle]="titleTpl"
                (click)="onSelect(menu)"
              >
                <ng-template #titleTpl>
                  <span class="ant-menu-title-content">
                    @if (menu.icon) {
                      <svg class="ant-menu-item-icon" CSvgIcon [name]="menu.icon" [size]="24"></svg>
                    }
                    <span>{{ t.instant(menu.label) }}</span>
                  </span>
                </ng-template>
                <ul>
                  <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }" />
                </ul>
              </li>
            }
          }
        </ng-template>
      </ul>
    </div>
  `,
  styleUrl: './index.less',

  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class LayoutAdminSide {
  EIcon = EIcon;
  APP_NAME = APP_NAME;
  public readonly sGlobal = inject(SGlobal);

  constructor(
    @Inject(TranslateService) public t: TFunction,
    @Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Menu';

    const node = document.createElement('div');
    node.setAttribute('class', 'overload');
    node.setAttribute('id', 'admin-side-overload');
    this.el.nativeElement.parentElement?.appendChild(node);

    effect(
      () => {
        const state = getState(this.sGlobal);

        this.el.nativeElement.setAttribute('class', state.isCollapseMenu ? 'active' : '');
        document
          .getElementById('admin-side-overload')
          ?.setAttribute('class', !state.isCollapseMenu ? 'overload active' : 'overload');
      },
      { allowSignalWrites: true },
    );
  }

  handleGoDashboard = () => {
    this.router.navigate([`/${this.sGlobal.language}${LINK.Dashboard}`]);
  };

  list: IMenu[] = [
    {
      key: LINK.Dashboard,
      icon: EIcon.Calendar,
      label: 'Dashboard',
    },
    {
      key: LINK.User,
      icon: EIcon.UserCircle,
      label: 'User',
      permission: KEY_ROLE.P_USER_INDEX,
      queryparams: { roleCode: 'SUPER-ADMIN' },
    },
    {
      key: LINK.QualityManagement,
      icon: EIcon.Check,
      label: 'QualityManagement',
      children: [
        {
          key: LINK.SummaryQuality,
          label: 'SummaryQuality',
        },
      ],
    },
  ];

  listMenu = computed(() =>
    this.list
      .filter(item => {
        return (
          !item.permission ||
          (!item.children && item.permission && this.sGlobal.user?.()?.role_model?.role_name?.includes(item.permission)) ||
          (item.children &&
            item.children.filter(
              subItem => !subItem.permission || this.sGlobal.user?.()?.role_model?.role_name?.includes(subItem.permission),
            ).length > 0)
        );
      })
      .map(item => ({
        ...item,
        label: item.label ?? '',
        children: item.children?.map(subItem => ({ ...subItem, label: subItem.label ?? '', level: 2 })),
      })),
  );

  /**
   * Finds a menu item by its key in the given array of menus.
   *
   * @param menus - The array of menus to search in.
   * @param key - The key of the menu item to find.
   * @returns The found menu item, or undefined if not found.
   */
  findMenu = (menus: IMenu[], key: string): IMenu | undefined => {
    let menuCurrent: IMenu | undefined;
    const forEachMenu = (menu: IMenu) => {
      if (menu.key === key) {
        menuCurrent = menu;
      } else if (menu.children) {
        menu.children.forEach(forEachMenu);
      }
    };
    menus.forEach(forEachMenu);
    return menuCurrent;
  };

  onSelect = ({ key, children }) => {
    const menu = this.findMenu(this.listMenu(), key);
    if (menu && !children) {
      this.router.navigate([`/${this.sGlobal.language?.()}${menu.key}`], { queryParams: menu.queryparams });
    }
  };
}
