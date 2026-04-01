import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Userspage } from './userspage/userspage';
import { Navbaradmin } from './navbaradmin/navbaradmin';
import { Hoteldata } from './hoteldata/hoteldata';
import { Packages } from './packages/packages';
import { Userbookings } from './userbookings/userbookings';
import { Contacts } from './contacts/contacts';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'navbaradmin', component: Navbaradmin },
  { path: 'userspage',   component: Userspage },
  { path: 'hoteldata',   component: Hoteldata },
  { path : 'packages', component: Packages },
  { path : 'bookings', component: Userbookings },
  { path : 'contacts', component: Contacts }
];
