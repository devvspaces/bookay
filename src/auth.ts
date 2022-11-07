import { NextApiRequest, NextApiResponse } from "next";
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { IncomingMessage, ServerResponse } from "http";


export async function authenticate(res: NextApiResponse, req: NextApiRequest, username: string){
    // Adds user id to cookie and timeout to expire cookie
    setCookie('username', username, { req, res, maxAge: 60 * 60 * 24 * 7 });
}


export async function authenticateSeller(res: NextApiResponse, req: NextApiRequest){
    // Auths seller
    setCookie('isSeller', true, { req, res, maxAge: 60 * 60 * 24 * 7 });
}


export function getLoggedInUsername({ req, res }: { req?: IncomingMessage, res?: ServerResponse<IncomingMessage> }) {
    // Gets user id from cookie
    return getCookie('username', { req, res });
}

export function getNextUrl() {

    // Get base url from window
    const baseUrl = window.location.origin;

    // Get next url from window
    const path = window.location.pathname + window.location.search;

    const url = new URL(path, baseUrl);
    const nextUrl = url.searchParams.get('next');

    if (!nextUrl) return "";

    // Check if nextUrl is a valid path
    const validStarts = ['/app', '/shop', '/books']
    for (const start of validStarts) {
        if (nextUrl.startsWith(start)) return nextUrl;
    }
    
    return "";
}


export function getLoginNextUrl() {
    const url = window.location.pathname;
    return "/login?next=" + url;
}


export function isLoggedIn(){
    const username = getCookie("username");
    if (!username) return false;
    return true;
}


export function isSellerLoggedIn(){
    const isSeller = getCookie("isSeller");
    if (!isSeller) return false;
    return true;
}


export function flushCookies(req: IncomingMessage, res: ServerResponse<IncomingMessage>){
    // Flushes all cookies
    deleteCookie('username', { req, res });
    deleteCookie('isSeller', { req, res });

    res.setHeader("Set-Cookie", [
        "username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "isSeller=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
}


export function logout(){
    deleteCookie('username');
    deleteCookie('isSeller');
}
