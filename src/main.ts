import { HttpClient, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import router from '@/router';
import { LANGUAGE } from '@/utils';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    router,
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: localStorage.getItem('i18nextLng') ?? LANGUAGE,
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient): TranslateHttpLoader => {
            return new TranslateHttpLoader(http, 'locales/', '/locale.json');
          },
          deps: [HttpClient],
        },
      }),
      BrowserAnimationsModule,
    ),
  ],
}).catch(err => console.error(err));
