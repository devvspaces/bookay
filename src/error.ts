import { NextApiResponse } from "next";
import { Dict } from "./utils";

export class ValidationError extends Error {
    constructor(error: Dict, message?: string) {
        super(message || "Error validating request");
        this.name = "ValidationError";
        this.cause = error;
    }
}

export class UnauthorizedError extends Error {
    constructor({ message, code=401 }: { message: string, code?: number }) {
        super(message || "Unauthorized");
        this.name = "UnauthorizedError";
        this.cause = code;
    }
}

function parseXataErrorMessage(message: string) {
    // Parse error message from xata if it can be parsed
    let match = message.match(/column \[(.+)\]: (.*)/);
    if (match) {
        return {
            field: match[1],
            message: match[2]
        };
    }
}

export const ErrorResponse = (error: unknown, res: NextApiResponse, labels?: Dict) => {

    if (error instanceof UnauthorizedError) {
        return res.status(error.cause as number).json({ message: error.message });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, errors: error.cause });
    }
    
    // @ts-ignore
    // Try to parse error message from xata
    let parse = parseXataErrorMessage(error.message);
    if (parse && labels) {
        return res.status(400).json({
            errors: {
                [parse.field]: `${labels[parse.field]} ${parse.message}`
            }
        });
    }
    res.status(500).json({ message: "Error processing your request, try again later." });
}