import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, ValidationError, UnauthorizedError } from "../../../src/error";
import { getSeller } from "../../../src/filebased";
import form from "../../../src/forms/books";
import { Book } from "../../../src/models/book";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data from your body
    const { id } = form.cleanData(req.body);

    const authorizationError = new UnauthorizedError({
        message: "You are not authorized to perform this action"
    });

    try {

        // Validate if user is logged in and is a seller
        const seller = await getSeller(req, res);

        if (!seller) {
            throw authorizationError;
        }

        // delete book
        const book = await Book.get(id)

        if (!book.book) {
            throw new Error("Book not found");
        }

        if (book.book.seller?.id !== seller.id) {
            throw authorizationError;
        }

        await book.book.delete()

        res.status(204).end();
    } catch (e){
        return ErrorResponse(e, res, form.getLabels());
    }

}