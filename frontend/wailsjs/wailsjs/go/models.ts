export namespace models {
	
	export class Settings {
	    favorite: boolean;
	    group: string;
	    icon: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.favorite = source["favorite"];
	        this.group = source["group"];
	        this.icon = source["icon"];
	        this.status = source["status"];
	    }
	}
	export class Card {
	    id: string;
	    card: string;
	    holder: string;
	    number: number;
	    // Go type: time
	    expiry: any;
	    security_code: number;
	    settings: Settings;
	
	    static createFrom(source: any = {}) {
	        return new Card(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.card = source["card"];
	        this.holder = source["holder"];
	        this.number = source["number"];
	        this.expiry = this.convertValues(source["expiry"], null);
	        this.security_code = source["security_code"];
	        this.settings = this.convertValues(source["settings"], Settings);
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
	export class Password {
	    id: string;
	    title: string;
	    username: string;
	    pwd: string;
	    settings: Settings;
	    created_date: string;
	
	    static createFrom(source: any = {}) {
	        return new Password(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.username = source["username"];
	        this.pwd = source["pwd"];
	        this.settings = this.convertValues(source["settings"], Settings);
	        this.created_date = source["created_date"];
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
	
	export class UserRequest {
	    account: string;
	    email: string;
	    Preference: Config;
	
	    static createFrom(source: any = {}) {
	        return new UserRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account = source["account"];
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

export namespace request {
	
	export class Card {
	    card: string;
	    holder: string;
	    number: number;
	    security_code: number;
	    month: number;
	    day: number;
	    settings: models.Settings;
	
	    static createFrom(source: any = {}) {
	        return new Card(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.card = source["card"];
	        this.holder = source["holder"];
	        this.number = source["number"];
	        this.security_code = source["security_code"];
	        this.month = source["month"];
	        this.day = source["day"];
	        this.settings = this.convertValues(source["settings"], models.Settings);
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
	export class Login {
	    account: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new Login(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account = source["account"];
	        this.password = source["password"];
	    }
	}
	export class Password {
	    userKey: string;
	    title: string;
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new Password(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.userKey = source["userKey"];
	        this.title = source["title"];
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}
	export class Recovery {
	    account: string;
	    new_password: string;
	
	    static createFrom(source: any = {}) {
	        return new Recovery(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account = source["account"];
	        this.new_password = source["new_password"];
	    }
	}
	export class Register {
	    account: string;
	    email: string;
	    password: string;
	    configs: models.Config;
	
	    static createFrom(source: any = {}) {
	        return new Register(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account = source["account"];
	        this.email = source["email"];
	        this.password = source["password"];
	        this.configs = this.convertValues(source["configs"], models.Config);
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
	export class SeedsCheck {
	    account: string;
	    seeds: string[];
	
	    static createFrom(source: any = {}) {
	        return new SeedsCheck(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.account = source["account"];
	        this.seeds = source["seeds"];
	    }
	}
	export class SimplePassword {
	    id: string;
	    title: string;
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new SimplePassword(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}

}

export namespace response {
	
	export class Login {
	    token: string;
	    userKey: string;
	
	    static createFrom(source: any = {}) {
	        return new Login(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.token = source["token"];
	        this.userKey = source["userKey"];
	    }
	}
	export class Register {
	    id: string;
	    account: string;
	    seeds: string[];
	
	    static createFrom(source: any = {}) {
	        return new Register(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.account = source["account"];
	        this.seeds = source["seeds"];
	    }
	}

}

