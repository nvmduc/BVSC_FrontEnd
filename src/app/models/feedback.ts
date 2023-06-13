export class Feedback{
    id!:string
    idShareholder!: string;
    content!:string
    constructor(id:string,idShareholder:string, content:string){
        this.id = id,
        this.idShareholder = idShareholder,
        this.content = content
    }
}