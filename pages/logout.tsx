import { logout } from "../src/auth";

export default function Logout(){
    logout();
    window.location.href = "/";
}