export namespace models {
	
	export class Config {
	    ui: string;
	    groups: string[];
	    language: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ui = source["ui"];
	        this.groups = source["groups"];
	        this.language = source["language"];
	    }
	}
	export class Data {
	    favorite: boolean;
	    group: string;
	    icon: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Data(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.favorite = source["favorite"];
	        this.group = source["group"];
	        this.icon = source["icon"];
	        this.status = source["status"];
	    }
	}
	export class UserRequest {
	    username: string;
	    email: string;
	    Preference: Config;
	
	    static createFrom(source: any = {}) {
	        return new UserRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.email = source["email"];
	        this.Preference = this.convertValues(source["Preference"], Config);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

