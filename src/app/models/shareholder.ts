export class Shareholder {
    id!: string
    fullname!: string
    shareHolderCode!: string
    identityCard!: string
    email!: string
    address!: string
    phoneNumber!: string
    nationality!: string
    username!: string
    password!: string
    status!: number
    idMeeting!: number
    numberShares!: number
    numberSharesAuth!: Number
    role!: number
    constructor(id:string, fullname: string, shareHolderCode: string, 
        identityCard: string, email: string, address: string, 
        phoneNumber: string, nationality: string,username:string,password:string,status:number, numberShares: number,
        numberSharesAuth: number, role: number,idMeeting: number) {
        this.id = id;
        this.fullname = fullname;
        this.shareHolderCode = shareHolderCode;
        this.identityCard = identityCard;
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.nationality = nationality;
        this.username = username;
        this.password = password;
        this.idMeeting = idMeeting;
        this.status = status;
        this.numberShares = numberShares;
        this.numberSharesAuth = numberSharesAuth
        this.role = role
    }

}

