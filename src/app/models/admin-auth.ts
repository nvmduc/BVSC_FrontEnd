export class UserAdmin {
    username?:string;
    password?:string;
    role?: number;
    constructor(username:string ,password:string, role:number){
        this.username = username;
        this.password = password;
        this.role = role;
    }
    
}

