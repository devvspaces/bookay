import { hash } from "bcrypt";
import { IncomingMessage, ServerResponse } from "http";
import { getCookie } from "cookies-next";
import { User } from "./models/user";
import { flushCookies, getLoggedInUsername } from "./auth";
import { GetServerSidePropsContext } from "next";
import { Book } from "./models/book";


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

export const reuseServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {

    // Get the seller
    const seller = await getSeller(req, res);

    const exit = {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    // If the seller is not found, redirect to the login page
    if (!seller) {
        return exit;
    }

    // Get the book id from the url
    const { id } = query;

    // Get the book from the database
    const book = await Book.get(id as string);

    // If the book is not found, redirect to the books page
    if (!book) {
        return {
            redirect: {
                destination: "/shop/books",
                permanent: false
            }
        }
    }

    // Check if seller owns the book
    if (book.book?.seller?.id !== seller.id) {
        return exit;
    }

    return {
        props: {
            book: book.serialize()
        }
    }

}