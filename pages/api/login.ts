import { NextApiRequest, NextApiResponse } from "next";
import { authenticate, authenticateSeller } from "../../src/auth";
import { ErrorResponse, ValidationError } from "../../src/error";
import { User } from "../../src/models/user";
import form from "../../src/forms/login";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;

    try {

        // Form validation
        const errors = form.validate(req.body);
        let message = "Details are incorrect";

        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors, message);
        }

        // Login or create new user
        const user = await User.login(username, password);

        if (!user) {
            errors["password"] = "Password is incorrect";
            throw new ValidationError(errors, message);
        }

        // authenticate user
        await authenticate(res, req, username);

        const isSeller = await user.isSeller();

        if (isSeller) {
            authenticateSeller(res, req)
        };

        res.status(200).json({ message: "Login successful", isSeller: isSeller });

    } catch (error) {
        return ErrorResponse(error, res, form.getLabels());
    }

}