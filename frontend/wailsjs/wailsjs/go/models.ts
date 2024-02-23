export namespace models {
	
	export class User {
	    id: string;
	    username: string;
	    email: string;
	    password: string;
	    encryptedUserKey: string;
	    created_at: string;
	    session_token: string;
	    token_expiry: string;
	
	    static createFrom(source: any = {}) {
	        return new User(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.username = source["username"];
	        this.email = source["email"];
	        this.password = source["password"];
	        this.encryptedUserKey = source["encryptedUserKey"];
	        this.created_at = source["created_at"];
	        this.session_token = source["session_token"];
	        this.token_expiry = source["token_expiry"];
	    }
	}

}

