import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstablecimientosPage } from './establecimientos.page';

const routes: Routes = [
  {
    path: '',
    component: EstablecimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstablecimientosPageRoutingModule {}
