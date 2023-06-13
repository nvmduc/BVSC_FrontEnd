export class Election{
    id!:string
    idMeeting!: number;
    title!: string;
    description!: string;
    numberOfElected!: number;
    createdTime!: any;
    modifiedTime!: any;
    status!:number;
    constructor(id:string,idMeeting:number, title:string,description:string,numberOfElected:number,createTime:string,modifiedTime:string,status:number){
        this.id = id,
        this.idMeeting = idMeeting,
        this.title = title,
        this.description = description,
        this.numberOfElected = numberOfElected,
        this.createdTime = createTime,
        this.modifiedTime = modifiedTime
        this.status = status
    }
}