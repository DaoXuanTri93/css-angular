import { CommonModule } from '@angular/common';
import { Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { filter } from 'rxjs';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services/global';
import { SLocal } from '@/services/local';
import { APP_NAME, LINK } from '@/utils';
import { TFunction } from '@/utils/angular';
import { LayoutAdminSide } from './side';

@Component({
  selector: 'layout-admin',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CommonModule, RouterOutlet, NzMenuModule, NzDropDownModule, LayoutAdminSide, CSvgIcon],
  template: `
    <div class="l-admin">
      <aside LayoutAdminSide></aside>
      <section>
        <header>
          <button class="hamburger" (click)="handleCollapseMenu()">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </button>
          <div class="right">
            <!-- <button nz-dropdown nzTrigger="click" [nzDropdownMenu]="language">
              <svg CSvgIcon [name]="$any(sGlobal.language?.())" [size]="24" class="rounded-lg"></svg>
            </button>
            <nz-dropdown-menu #language="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item *ngIf="sGlobal.language?.() !== 'en'">
                  <button (click)="changeLanguage('en')">
                    <svg CSvgIcon [name]="EIcon.En" [size]="24" class="rounded-lg"></svg>
                    English
                  </button>
                </li>
                <li nz-menu-item *ngIf="sGlobal.language?.() !== 'vi'">
                  <button (click)="changeLanguage('vi')">
                    <svg CSvgIcon [name]="EIcon.Vi" [size]="24" class="rounded-lg"></svg>
                    Tiếng Việt
                  </button>
                </li>
              </ul>
            </nz-dropdown-menu> -->
            <!-- <button (click)="changeTheme()">
              <svg CSvgIcon [name]="EIcon.DayNight" [size]="24"></svg>
            </button> -->
            <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
            <div class="leading-none" nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
              <p class="text-sm font-semibold">{{ sGlobal.user?.()?.member_full_name }}</p>
              <span class="text-xs text-base-content/40">{{ sGlobal.user?.()?.email }}</span>
            </div>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.MyProfile, { tab: 'MyProfile' })">
                    <svg CSvgIcon [name]="EIcon.UserCircle" [size]="20"></svg>
                    {{ t.instant('MyProfile') }}
                  </button>
                </li>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.MyProfile, { tab: 'MyProfile' })">
                    <svg CSvgIcon [name]="EIcon.Key" [size]="20"></svg>
                    {{ t.instant('ChangePassword') }}
                  </button>
                </li>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.Login)">
                    <svg CSvgIcon [name]="EIcon.Out" [size]="20"></svg>
                    {{ t.instant('SignOut') }}
                  </button>
                </li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </header>
        <main class="scrollbar">
          <router-outlet></router-outlet>
        </main>
      </section>
    </div>
  `,
  styleUrl: './index.less',
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class LayoutAdmin {
  EIcon = EIcon;
  LINK = LINK;
  APP_NAME = APP_NAME;
  public readonly sGlobal = inject(SGlobal);
  public readonly sLocal = inject(SLocal());

  constructor(
    @Inject(TranslateService) public t: TFunction,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Layouts';
    router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.sLocal.reset();
    });
  }

  handleCollapseMenu = () => {
    this.sGlobal.set({ isCollapseMenu: !this.sGlobal.isCollapseMenu?.() });
  };

  changeTheme = () => {
    const html = document.querySelector('html');
    const dataTheme = html?.getAttribute('data-theme');
    const theme = dataTheme === 'light' ? 'dark' : 'light';
    html?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  changeLanguage = lang => {
    const path = this.router.url.replace(/^\/[a-z]{2}/, `/${lang}`);
    this.t.use(lang);
    this.sGlobal.setLanguage(lang);
    this.router.navigate([path], { replaceUrl: true });
  };

  changePage = (link: string, queryParams?: any) =>
    this.router.navigate([`/${this.sGlobal.language}${link}`], { queryParams });
}
