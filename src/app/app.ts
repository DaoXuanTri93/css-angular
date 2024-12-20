import { Component, inject, Inject, type OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SGlobal } from './services/global';
import { KEY_DATA, LANGUAGE } from './utils';
export let message: NzMessageService;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public readonly sGlobal = inject(SGlobal);

  constructor(
    @Inject(NzMessageService) readonly message: NzMessageService,
    @Inject(TranslateService) readonly t: TranslateService,
    @Inject(Router) readonly router: Router,
    @Inject(NzI18nService) readonly i18n: NzI18nService,
  ) {
    // Setup theme
    localStorage.getItem('theme');
    this.i18n.setLocale(en_US);
    const themeSystem =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.querySelector('html')?.setAttribute('data-theme', localStorage.getItem('theme') ?? themeSystem);

    // Call api to update data in local storage by set false key name isLatest
    Object.keys(KEY_DATA).forEach(value => {
      const key = value as keyof typeof KEY_DATA;
      const local = JSON.parse(localStorage.getItem(KEY_DATA[key]) ?? '{}');
      if (!local.data) local.data = [];
      localStorage.setItem(KEY_DATA[key], JSON.stringify({ ...local, isLatest: false }));
    });
  }

  ngOnInit(): void {
    // set function call message ant design vue to global variable message
    message = this.message;

    // set default language by router
    this.sGlobal.setLanguage(LANGUAGE);
    this.t.setDefaultLang(LANGUAGE);
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) NProgress.start();
      if (event instanceof NavigationEnd) NProgress.done();
    });
  }
}
