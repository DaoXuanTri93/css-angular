import { provideRouter, withHashLocation } from '@angular/router';
import { KEY_TOKEN, LANGUAGE, LINK } from './utils';
export const router = provideRouter(
  [
    {
      path: '',
      redirectTo: `/${LANGUAGE}${!localStorage.getItem(KEY_TOKEN) ? LINK.Login : LINK.Dashboard}`,
      pathMatch: 'full',
    },
    {
      path: ':lang',
      // canActivate: [LanguageGuard],
      children: [
        {
          path: 'auth',
          loadComponent: () => import('./layouts/auth').then(m => m.LayoutAuth),
          children: [
            {
              path: 'login',
              loadComponent: () => import('./pages/base/login').then(m => m.PageLogin),
            },
          ],
        },
        {
          path: '',
          loadComponent: () => import('./layouts/admin').then(m => m.LayoutAdmin),
          children: [
            {
              path: 'dashboard',
              loadComponent: () => import('./pages/dashboard/index').then(m => m.PageDashboard),
            },
            {
              path: 'qualitymanagement',
              loadComponent: () =>
                import('./pages/base/quality-management/summary/index.component').then(m => m.SummaryQualityComponent),
              children: [
                {
                  path: 'summaryquality',
                  loadComponent: () =>
                    import('./pages/base/quality-management/summary/index.component').then(
                      m => m.SummaryQualityComponent,
                    ),
                },
                // { path: '**', redirectTo: 'projectmanager', pathMatch: 'full' },
              ],
            },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
          ],
        },
        // {
        //   path: '',
        //   canActivate: [AuthGuard],
        //   loadChildren: () => import('./module/admin/admin.module').then((m) => m.AdminModule),
        // },
      ],
    },
    { path: '**', redirectTo: localStorage.getItem('ng-language') ?? LANGUAGE + '', pathMatch: 'full' },
  ],
  withHashLocation(),
);
export default router;
