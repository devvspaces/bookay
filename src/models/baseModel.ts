import { getXataClient, UsersRecord } from "../xata";

// Create error class not implemented
class ErrorNotImplemented extends Error {
    constructor() {
        super("Not Implemented");
    }
}


export class BaseModel {

    constructor() {
        if (this.constructor === BaseModel) {
            throw new ErrorNotImplemented();
        }
    }

    
    db() {
        // this let's us call db() from the class, giving access to the db
        return getXataClient().db;
    }

    static db() {
        // this let's us call db() from the class, giving access to the db
        return getXataClient().db;
    }
}