import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, UnauthorizedError } from "../../../src/error";
import { getUser } from "../../../src/filebased";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        // Get cart id from your body
        const { id } = req.body;

        const authorizationError = new UnauthorizedError({
            message: "You are not authorized to perform this action"
        });
    
        // Validate if user is logged in
        const user = await getUser(req, res);

        if (!user) {
            throw authorizationError;
        }

        // Verify if user owns the cart item
        const cartItem = await user.ownsCartItem(id)

        if (!cartItem) {
            throw authorizationError;
        }

        await cartItem.delete()

        res.status(204).end();

    } catch (e) {
        return ErrorResponse(e, res);
    }

}