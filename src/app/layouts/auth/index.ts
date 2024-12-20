import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { APP_NAME } from '@/utils';
import { TFunction } from '@/utils/angular';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'layout-auth',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, TranslateModule, CSvgIcon],
  template: `
    <div class="l-login">
      <div class="wrapper">
        <div class="t-head -intro-x">
          <div class="block-grap-1">
            <svg CSvgIcon [name]="EIcon.Logo" [size]="24" className="fill-primary"></svg>
            <h4>{{ APP_NAME }}</h4>
          </div>
          <h5 class="uppercase">{{ 'EnterpriseManagementSystem' | translate }}</h5>
        </div>
        <div class="content intro-x">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styleUrl: './index.less',

  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class LayoutAuth {
  EIcon = EIcon;
  APP_NAME = APP_NAME;
  constructor(@Inject(TranslateService) public t: TFunction) {
    this.t.prefix = 'Pages.Base.Login';
  }
}
