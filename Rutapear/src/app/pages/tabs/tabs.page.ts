import { Component } from '@angular/core';
import { SelladoService } from '../../services/sellado.service';
import { RutasFavoritasService } from '../../services/rutas-favoritas.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private _sellado:SelladoService,
    private _favorito:RutasFavoritasService
  ) {}

  activarHistoricos(i:number){
    switch (i) {
      case 1:
        
        this._sellado.activarHistorico = false;
        this._favorito.activarFavoritos = false;
        break;

      case 2: 
        
        this._favorito.activarFavoritos = false;
        this._sellado.activarHistorico = true;
        break;

      case 3: 
        
        this._sellado.activarHistorico = false;
        this._favorito.activarFavoritos = true;
        break;
    
      default:
        break;
    }
  }

}
