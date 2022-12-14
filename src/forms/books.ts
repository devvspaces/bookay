import Form, { FormField } from "../../components/form";
import styles from "../../pages/shop/books/books.module.css";
import { BookSerialized } from "../models/book";


export const createFields = () => {
    const formFields: FormField[] = [
        {
            name: "title",
            required: true,
            placeholder: "Title",
        },
        {
            name: "author",
            required: true,
            placeholder: "Author",
        },
        {
            name: "isbn",
            label: "ISBN",
            required: true,
            placeholder: "ISBN",
        },
        {
            name: "price",
            label: "Price (₦)",
            type: "number",
            required: true,
            placeholder: "Price",
            props: {
                min: 0,
                step: 0.01,
            },
        },
        {
            name: "quantity",
            type: "number",
            required: true,
            placeholder: "Quantity",
            props: {
                min: 1,
            },
        },
        {
            name: "image",
            required: true,
            display: false,
        }
    ]
    return formFields;
}


export default new Form({
    fields: createFields(),
    submitClassName: styles.saveBtn,
    submitText: "Add New Book",
    reponseCallback: ({ data }) => {
        const book = data.data as BookSerialized;
        window.location.href = "/shop/books/update/" + book.id;
    },
});