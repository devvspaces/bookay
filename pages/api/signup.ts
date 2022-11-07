import { NextApiRequest, NextApiResponse } from "next";
import { authenticate, authenticateSeller } from "../../src/auth";
import { ErrorResponse, ValidationError } from "../../src/error";
import { Seller } from "../../src/models/seller";
import form from "../../src/forms/signup";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data from your body
    const { username, password, storeName, phone, address } = req.body;

    try {

        const errors = form.validate(req.body);
        let message = "";

        // Validate data
        if (Object.keys(errors).length > 0) {
            message = "All fields are required";
            throw new ValidationError(errors, message);
        }

        // Create seller
        const seller = await Seller.createAccount(storeName, phone, address, username, password);
        
        if (!seller?.profile?.user?.id) {
            return res.status(400).json({ message: "Unable to create account" });
        }

        // authenticate seller
        await authenticate(res, req, username);
        await authenticateSeller(res, req);

        res.status(201).json({ message: "Account created successfully" });

    } catch (e){
        return ErrorResponse(e, res, form.getLabels());
    }

}