export class UserAdmin {
    idCompany?: number;
    username?:string;
    password?:string;
    constructor(username:string ,password:string, idCompany:number){
        this.username = username;
        this.password = password;
        this.idCompany = idCompany;
    }
    
}

