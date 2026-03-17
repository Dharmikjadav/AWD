import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { Userspage } from './userspage/userspage';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
      Userspage
  ]
})
export class AdminModule { }
