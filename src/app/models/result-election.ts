export class ResultElection{
    idCandidate!:string
    idShareholder!:string
    numberSharesForCandidate!:number
    constructor(idCandidate:string, idShareholder:string,numberSharesForCandidate:number){
        this.idCandidate = idCandidate,
        this.idShareholder = idShareholder,
        this.numberSharesForCandidate = numberSharesForCandidate
    }
}