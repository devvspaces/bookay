import Form, { FormField } from "../../components/form";
import { OrderSerialized } from "../models/order";
import { states, LGAs } from "../states/states";


export const createFields = () => {
    const formFields: FormField[] = [
        {
            name: "fullname",
            required: true,
            label: "Full Name",
            placeholder: "Enter your full name",
        },
        {
            name: "phone",
            required: true,
            placeholder: "Enter your phone number",
        },
        {
            name: "state",
            label: "State",
            type: "select",
            required: true,
            choices: states,
            placeholder: "Select your state",
        },
        {
            name: "lga",
            label: "LGA",
            type: "select",
            required: true,
            choices: LGAs,
            placeholder: "Select your LGA",
        },
        {
            name: "address",
            required: true,
            placeholder: "Enter your address",
        }
    ]
    return formFields;
}


export default new Form({
    fields: createFields(),
    submitText: "Complete Checkout",
    reponseCallback: ({ data }) => {
        const order = data.data as OrderSerialized;
        window.location.href = "/app/orders/" + order.id;
    },
});