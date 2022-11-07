import Form from "../../components/form";
import { WrappedReponse } from "../utils";
import styles from "../../styles/login.module.css";


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
        },
        {
            name: "storeName",
            label: "Store name",
            required: true
        },
        {
            name: "phone",
            required: true
        },
        {
            name: "address",
            required: true
        }
    ],
    formGroupClassName: styles.formGroup,
    submitText: "Sign Up",
    reponseCallback: () => {
        window.location.href = "/shop/dashboard";
    }
});