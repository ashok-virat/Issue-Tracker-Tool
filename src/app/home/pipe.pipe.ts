import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class PipePipe implements PipeTransform {

  transform(data:any,values: string, input: string): any {
    if(!input)
      
    return data ;
  


   return data.filter((item)=> values.split(',').some(key=>item.hasOwnProperty(key) && new RegExp(input,'gi').test(item[key])));
  }

}
