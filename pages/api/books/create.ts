import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, ValidationError, UnauthorizedError } from "../../../src/error";
import { getSeller } from "../../../src/filebased";
import form from "../../../src/forms/books";
import { Book } from "../../../src/models/book";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data from your body
    const data = form.cleanData(req.body);

    const authorizationError = new UnauthorizedError({
        message: "You are not authorized to perform this action"
    });

    try {

        const errors = form.validate(req.body);
        let message = "";

        // Validate data
        if (Object.keys(errors).length > 0) {
            message = "All fields are required";
            throw new ValidationError(errors, message);
        }


        // Validate if user is logged in and is a seller
        const seller = await getSeller(req, res);

        if (!seller) {
            throw authorizationError;
        }

        // Create book
        const book = await Book.create(data, seller)

        res.status(201).json({ message: "Book created successfully", data: await book.serialize() });

    } catch (e){
        return ErrorResponse(e, res, form.getLabels());
    }

}