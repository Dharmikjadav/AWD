import { RouterModule, Routes } from '@angular/router';
import { Footer } from './components/core-component/footer/footer';
import { Dashboard } from './components/core-component/dashboard/dashboard';
import { PageNotFound } from './components/core-component/page-not-found/page-not-found';
import { Registration } from './components/core-component/registration/registration';
import { Hotels } from './components/core-component/hotels/hotels';
import { ContactUs } from './components/core-component/contact-us/contact-us';
import { Facilities } from './components/core-component/facilities/facilities';
import { Navbar } from './components/core-component/navbar/navbar';
import { UserLogin } from './components/core-component/user-login/user-login';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { Packages } from './components/core-component/packages/packages';
import { Bookhotel } from './components/core-component/bookhotel/bookhotel';
import { Profile } from './components/core-component/profile/profile';
import { Payment } from './components/core-component/payment/payment';
import { MyBookings } from './components/core-component/my-bookings/my-bookings';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'navbar', component: Navbar },
  { path: 'hotels', component: Hotels, canActivate: [AuthGuard] },
  { path: 'contact_us', component: ContactUs, canActivate: [AuthGuard] },
  { path: 'facilities', component: Facilities, canActivate: [AuthGuard] },
  { path: 'footer', component: Footer },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'packages', component: Packages, canActivate: [AuthGuard] },
  { path: 'booking', component: Bookhotel },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'my-bookings', component: MyBookings, canActivate: [AuthGuard] },
  { path: 'user-login', component: UserLogin },

  { path: 'registarion-form', component: Registration },
  { path: 'payment', component: Payment, canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin/admin.routs').then(m => m.ADMIN_ROUTES) },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }