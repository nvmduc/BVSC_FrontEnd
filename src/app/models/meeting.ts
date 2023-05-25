export class Meeting {
    id!: number
    idCompany!: string
    nameMeeting!: string
    numberOrganized!: number
    yearOrganized!: number
    status!: any
    imageBanner!: any
    startTime!: Date
    endTime!: Date
    address!: string
    constructor(id: number, idCompany: string, nameMeeting: string, numberOrganized: number, yearOrganized: number, status: any, imageBanner: any, startTime: Date, endTime: Date, address: string) {
        this.id = id,
        this.idCompany = idCompany
        this.nameMeeting = nameMeeting
        this.numberOrganized = numberOrganized
        this.yearOrganized = yearOrganized
        this.status = status
        this.imageBanner = imageBanner
        this.startTime = startTime
        this.endTime = endTime
        this.address = address
    }
}