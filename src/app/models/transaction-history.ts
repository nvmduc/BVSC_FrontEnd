export class TransactionHistory{
    idShareholder!:string
	idShareholderAuth!:string
	amount!:number
    constructor(idShareholder:string, idShareholderAuth:string,amount:number){
        this.idShareholder = idShareholder,
        this.idShareholderAuth = idShareholderAuth,
        this.amount = amount
    }
}