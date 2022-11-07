import Form from "../../components/form";
import { getNextUrl } from "../auth";
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

        const nextUrl = getNextUrl();

        if (nextUrl){
            window.location.href = nextUrl;
            return;
        }

        if (data.isSeller) {
            window.location.href = "/shop/dashboard"
            return;
        }
    
        window.location.href = "/";
    }
});