import { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, UnauthorizedError } from "./error";
import { getUser } from "./filebased"; 
import { Order } from "./models/order"; 


export default async function Marker(req: NextApiRequest, res: NextApiResponse, mark: "delivered" | "in-transit") {

    try {

        // Get data from your body
        const data = req.body;

        const authorizationError = new UnauthorizedError({
            message: "You are not authorized to perform this action"
        });


        // Validate if user is logged in
        const user = await getUser(req, res);

        if (!user?.user) {
            throw authorizationError;
        }

        // Get the order
        const order = await Order.get(data.id);

        // Check if order exists and user owns order
        if (!order?.order || (order.order.user?.id !== user.user.id)) {
            throw authorizationError;
        }

        // Mark order as mark
        let message = "";
        if (mark === "delivered") {
            await order.markAsDelivered();
            message = "Order marked as delivered successfully";
        } else {
            await order.markAsInTransit();
            message = "Order marked as in transit successfully";
        }

        res.status(200).json({ message: message });

    } catch (e) {
        return ErrorResponse(e, res);
    }

}