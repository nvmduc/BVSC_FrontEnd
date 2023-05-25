export class Voting{
    id!:string
    idMeeting!: string;
    content!: string;
    createdTime!: Date;
    modifiedTime!: Date;
    constructor(id:string,idMeeting:string, content:string,createTime:Date,modifiedTime:Date){
        this.id = id,
        this.idMeeting = idMeeting,
        this.content = content,
        this.createdTime = createTime,
        this.modifiedTime = modifiedTime
    }
}