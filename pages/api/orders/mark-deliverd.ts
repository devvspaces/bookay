import { NextApiRequest, NextApiResponse } from "next";
import Marker from "../../../src/api";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return Marker(req, res, "delivered");
}