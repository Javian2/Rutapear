import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroRuta'
})
export class FiltroRutaPipe implements PipeTransform {

  transform(arreglo: any[], texto: string = ''): any[] {

    if(texto === ''){
      return arreglo;
    }

    if(!arreglo){
      return arreglo;
    }

    texto = texto.toLocaleLowerCase();

    return arreglo.filter(
      item => item.nombre.toLowerCase().includes(texto) || item.ubicacion.toLowerCase().includes(texto)
    )

    return null;
  }

}
