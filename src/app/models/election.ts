export class Election{
    id!:string
    idMeeting!: number;
    title!: string;
    description!: string;
    createdTime!: any;
    modifiedTime!: any;
    constructor(id:string,idMeeting:number, title:string,description:string,createTime:string,modifiedTime:string){
        this.id = id,
        this.idMeeting = idMeeting,
        this.title = title,
        this.description = description,
        this.createdTime = createTime,
        this.modifiedTime = modifiedTime
    }
}