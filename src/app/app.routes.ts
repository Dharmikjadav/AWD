import { Routes } from '@angular/router';
import { Footer } from './components/core-component/footer/footer';
import { Dashboard } from './components/core-component/dashboard/dashboard';
import { PageNotFound } from './components/core-component/page-not-found/page-not-found';
import { Registration } from './components/core-component/registration/registration';
import { Hotels } from './components/core-component/hotels/hotels';
import { ContactUs } from './components/core-component/contact-us/contact-us';
import { Facilities } from './components/core-component/facilities/facilities';
import { Navbar } from './components/core-component/navbar/navbar';

export const routes: Routes = [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }, // redirect to `first-component`
    { path: 'navbar', component: Navbar },
    { path: 'hotels', component: Hotels },
    { path: 'contact_us', component: ContactUs },
    { path: 'facilities', component: Facilities },
    { path: 'footer', component: Footer },
    { path: 'dashboard', component: Dashboard },
    { path: 'registarion-form', component: Registration },
    { path: '**', component: PageNotFound }
];
