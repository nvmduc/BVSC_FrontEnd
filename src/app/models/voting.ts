export class Voting{
    id!:string
    idMeeting!: string;
    content!: string;
    createdTime!: any;
    modifiedTime!: any;
    constructor(id:string,idMeeting:string, content:string,createTime:string,modifiedTime:string){
        this.id = id,
        this.idMeeting = idMeeting,
        this.content = content,
        this.createdTime = createTime,
        this.modifiedTime = modifiedTime
    }
}