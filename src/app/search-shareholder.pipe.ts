import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchShareholder'
})
export class SearchShareholderPipe implements PipeTransform {
  transform(items: any[], searchIdentityCard: string): any[] {
    if (!items) return [];
    if (!searchIdentityCard) return items;
  
    searchIdentityCard = searchIdentityCard.toLowerCase();
  
    return items.filter(item => {
      // if (item && item.identityCard && item.fullname && item.phoneNumber && item.email && item.shareholderCode) {
        return (item.identityCard && item.identityCard.toLowerCase().includes(searchIdentityCard)) ||
          (item.fullname && item.fullname.toLowerCase().includes(searchIdentityCard)) ||
          (item.phoneNumber && item.phoneNumber.toLowerCase().includes(searchIdentityCard)) ||
          (item.email && item.email.toLowerCase().includes(searchIdentityCard)) ||
          (item.shareHolderCode && item.shareHolderCode.toLowerCase().includes(searchIdentityCard)) ;
      // }
      // return false;
    });
  }
  
}
