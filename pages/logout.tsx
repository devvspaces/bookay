import { useRouter } from "next/router";
import { logout } from "../src/auth";

export default function Logout(){
    logout();
    
    // Redirect to the home page using nextjs router
    // https://nextjs.org/docs/api-reference/next/router
    const router = useRouter();
    router.push("/");

    return null;
}