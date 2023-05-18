export class User {
    username?:string;
    password?:string;
    roles?:any;
    constructor(username:string ,password:string, roles:any){
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
    
}

