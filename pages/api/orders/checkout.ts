import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, ValidationError, UnauthorizedError } from "../../../src/error";
import { getUser } from "../../../src/filebased";
import form from "../../../src/forms/checkout";
import { Order } from "../../../src/models/order";


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


        // Validate if user is logged in
        const user = await getUser(req, res);

        if (!user?.user) {
            throw authorizationError;
        }

        // Create order
        const order = await Order.checkout(data, user);

        res.status(201).json({ message: "Order created successfully", data: order.serialize() });

    } catch (e){
        return ErrorResponse(e, res, form.getLabels());
    }

}