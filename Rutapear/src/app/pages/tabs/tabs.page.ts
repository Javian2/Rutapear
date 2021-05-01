import { Component } from '@angular/core';
import { SelladoService } from '../../services/sellado.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private _sellado:SelladoService
  ) {}

  activarHistoricos(i:number){
    switch (i) {
      case 1:
        this._sellado.activarHistorico = false;
        break;

      case 2: 
        this._sellado.activarHistorico = true;
    
      default:
        break;
    }
  }

}
