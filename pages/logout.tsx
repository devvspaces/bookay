import { useEffect } from "react";
import { logout } from "../src/auth";

export default function Logout(){
    logout();
    
    useEffect(() => {
        window.location.href = "/";
    }, []);
}