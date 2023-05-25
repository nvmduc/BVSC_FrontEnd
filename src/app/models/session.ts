export class Session{
    sesionId!:string
    idShareholder!:string
    startTime!:Date
    endTime!:Date
    ipAddress!:string
    deviceType!:string
    constructor(sesionId:string, idShareholder:string,startTime:Date,endTime:Date,ipAddress:string,deviceType:string){
        this.sesionId = sesionId,
        this.idShareholder = idShareholder,
        this.startTime = startTime,
        this.endTime = endTime,
        this.ipAddress = ipAddress,
        this.deviceType = deviceType
    }
}
