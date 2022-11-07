import { getCookie } from "cookies-next";
import Form from "../../components/form";
import { WrappedReponse } from "../utils";


export default new Form({
    fields: [
        {
            name: "username",
            required: true
        },
        {
            name: "password",
            required: true,
            type: "password"
        }
    ],
    submitText: "Login",
    reponseCallback: ({ data }: WrappedReponse) => {

        const nextUrl = getCookie("next");

        if (nextUrl){
            window.location.href = nextUrl.toString();
        }

        if (data.isSeller) {
            window.location.href = "/shop/dashboard"
            return;
        }
        window.location.href = "/";
    }
});