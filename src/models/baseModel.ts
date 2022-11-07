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
        return getXataClient().db;
    }

    static db() {
        return getXataClient().db;
    }
}