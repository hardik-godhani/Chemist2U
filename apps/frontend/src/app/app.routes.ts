import { Route } from '@angular/router';
import { RulesPageComponent } from './pages/rules-page/rules-page.component';
import { ContactsPageComponent } from './pages/contacts-page/contacts-page.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'rules', pathMatch: 'full' },
  { path: 'rules', component: RulesPageComponent },
  { path: 'contacts', component: ContactsPageComponent },
];
