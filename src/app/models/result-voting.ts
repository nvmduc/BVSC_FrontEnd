export class ResultVoting{
    // id!:number
    idVoting!:string
    idShareholder!:string
    status!:number
    constructor(idVoting:string, idShareholder:string,status:number){
        // this.id = id,
        this.idVoting = idVoting,
        this.idShareholder = idShareholder,
        this.status = status
    }
}