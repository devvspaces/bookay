import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, UnauthorizedError } from "../../../src/error";
import { getUser } from "../../../src/filebased";
import { Book } from "../../../src/models/book";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data from your body
    const { bookId } = req.body;

    const authorizationError = new UnauthorizedError({
        message: "You are not authorized to perform this action"
    });

    try {

        // Validate if user is logged in
        const user = await getUser(req, res);

        if (!user) {
            throw authorizationError;
        }

        // Add book to cart
        await Book.addToCart(bookId, user.user?.id as string)

        res.status(201).json({ message: "Added to cart successfully" });

    } catch (e){
        return ErrorResponse(e, res);
    }

}