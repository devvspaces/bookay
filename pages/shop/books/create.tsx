import form from "../../../src/forms/books";
import ImageWidget from "../../../components/upload-widget";
import styles from "./books.module.css";
import { bookSubmitEvent } from "../../../src/book-event";
import { CloudinaryHead } from "../../../components/cloudinary";


export default function Books() {

    form.buildStateValidators();

    // get image field error state value
    const imageError = form.stateValidators.image.stateValue;

    return (
        <div>

            <CloudinaryHead />


            <h1 className={styles.head}>Add New Book</h1>

            <form className={styles.bookInfo} onSubmit={bookSubmitEvent(form)} action={form.buildUrl("/books/create")}>

                <ImageWidget error={imageError} />

                <div className={styles.bookDetails + " " + styles.bookForm}>
                    {form.render()}
                </div>

            </form>
        </div>
    );
}