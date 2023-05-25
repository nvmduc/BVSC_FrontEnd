export class Candidate{
    id!:number
    idElection!: string;
    fullname!: string;
    birthday!: Date;
    address!: string;
    summaryInfo!: string;
    constructor(id:number,idElection:string, fullname:string,birthday:Date,address:string,summaryInfo:string){
        this.id = id,
        this.idElection = idElection,
        this.fullname = fullname,
        this.birthday = birthday,
        this.address = address,
        this.summaryInfo = summaryInfo
    }
}