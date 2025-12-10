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

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // redirect to `first-component`
    { path: 'navbar', component: Navbar },
    { path: 'hotels', component: Hotels ,canActivate:  [AuthGuard]},
    { path: 'contact_us', component: ContactUs,canActivate:  [AuthGuard] },
    { path: 'facilities', component: Facilities,canActivate:  [AuthGuard] },
    { path: 'footer', component: Footer },
    { path: 'dashboard', component: Dashboard, canActivate:  [AuthGuard] },
    { path: 'user-login', component: UserLogin },
    { path: 'registarion-form', component: Registration },
    { path: '**', component: PageNotFound }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }