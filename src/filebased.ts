import { hash } from "bcrypt";
import { Seller } from "./models/seller";
import { IncomingMessage, ServerResponse } from "http";
import { getCookie } from "cookies-next";
import { User } from "./models/user";
import { flushCookies, getLoggedInUsername } from "./auth";


export async function hashPassword(password: string) {
    return await hash(password, 10);
}


export async function getUser(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    // Gets user id from cookie
    const username = getLoggedInUsername({ req, res });

    if (!username) {
        // Clear cookies
        flushCookies(req, res);
        return
    }

    return await User.getUser(username as string);
}


export async function getSeller(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {

    const user = await getUser(req, res);

    if (!user) {
        // Clear cookies
        flushCookies(req, res);
        return
    }

    // Gets user id from cookie
    const isSeller = getCookie('isSeller', { req, res });

    if (!isSeller) {
        // Clear cookies
        flushCookies(req, res);
        return
    }

    // Check if user is a seller
    const isUserSeller = await user.isSeller();

    if (!isUserSeller) {
        // Clear cookies
        flushCookies(req, res);
        return
    }

    return await user.seller();
}