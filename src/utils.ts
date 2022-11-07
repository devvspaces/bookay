import { logout } from "./auth";

export function getDate() {
    return readableDate(new Date())
}

export function readableDate(date: Date | null | undefined) {
    if (!date) return "";
    return date.toLocaleString("en-US", { day: "2-digit", month: "long", year: "numeric" })
}


export type Dict = { [key: string]: string };

export type WrappedReponse = { success: boolean, code: number, data: { [key: string]: string | undefined | Dict, errors?: Dict } }
/**
 * Wraps the response json with a success key and status code
 * @param res fetch response
 * @returns 
 */
const wrapResponse = async (res: Response): Promise<WrappedReponse> => {
    let success = res.ok;
    const data: Dict = res.status !== 204 ? await res.json() : {};
    return { success, code: res.status, data };
}

export async function _postURL(url: string, data: Dict) {
    const _data = JSON.stringify(data);

    return await postURL(url, _data);
}

export async function postURL(url: string, data: string) {

    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data
    }).then(wrapResponse).catch((e) => {
        console.error(e);
        return { success: false, code: 500, data: { message: "Error processing your request" } }
    });

}

export async function _deleteURL(url: string, data: Dict) {
    const _data = JSON.stringify(data);

    return await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: _data
    }).then(wrapResponse)
        .then(res => {
            if (res.code !== 204) {
                res.success = false;
            }
            return res;
        });
}

export async function deleteURL(url: string, id: string) {
    return await _deleteURL("/api" + url, { id });
}

export function buildUrl(url: string, params: Dict) {
    const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}`;
}

export async function getURL(url: string, data: FormData) {
    const params = Object.fromEntries(data.entries() as IterableIterator<[string, string]>);
    return await _getURL(url, params);
}

export async function _getURL(url: string, data: Dict) {
    return await fetch(buildUrl(url, data)).then(wrapResponse);
}


export type FetchBuild = {
    url: string,
    data?: Dict,
    success?: ({ res }: { res: WrappedReponse }) => void,
    error?: ({ res }: { res: WrappedReponse }) => void,
    method?: "post" | "delete" | "get",
}

export async function fetchBuilder({ url, data, success, error, method = "post" }: FetchBuild) {

    const fetchers = {
        post: _postURL,
        delete: _deleteURL,
        get: _getURL
    }

    const fetchFunction = fetchers[method];

    await fetchFunction("/api" + url, data || {}).then((res) => {
        if (res.data.message) alert(res.data.message);

        if (res.code === 401) {
            // Logout
            logout();
            window.location.href = "/login";
        }

        if (res.success) {
            if (success) success({ res });
        } else {
            if (error) error({ res });
        }

    });

}


export const capitalize = function (value: string) {
    // Capitalize the first letter of the string
    return value.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    });
}

export const humanizeNumber = function (value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
