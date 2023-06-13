export class Company{
    id!: number;
    companyName!:string;
    stockCode!:string;
    taxCode!:number;
    address!:string
    foundedYear!:any
    constructor(id:number,companyName:string, stockCode:string,taxCode:number,address:string,foundedYear:any){
        this.id = id,
        this.companyName = companyName,
        this.stockCode = stockCode,
        this.taxCode = taxCode,
        this.address = address,
        this.foundedYear = foundedYear
    }
}