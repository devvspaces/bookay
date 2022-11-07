import form from "../../../../src/forms/books";
import styles from "../books.module.css";
import { Cloudinary } from "@cloudinary/url-gen";
import { reuseServerSideProps } from "../../../../src/filebased";
import { BookSerialized } from "../../../../src/models/book";
import ImageWidget, { cloudName } from "../../../../components/upload-widget";
import { GetServerSidePropsContext } from "next";
import { bookSubmitEvent } from "../../../../src/book-event";
import { CloudinaryHead } from "../../../../components/cloudinary";
import { useEffect } from "react";

export default function Books({ book }: { book: BookSerialized }) {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });

    let imageUrl = undefined;

    if (book.image) {
        // Instantiate a CloudinaryImage object for the image with public ID, 'sample'.
        const myImage = cld.image(book.image);

        // Return the delivery URL
        imageUrl = myImage.toURL();
    }

    useEffect(() => {
        // Update form fields values with book data
        form.fields.forEach(field => {
            const value = book[field.name];
            if (value) {
                const documentField = document.getElementById(form.getFieldID(field)) as HTMLInputElement;
                if (documentField) {
                    documentField.value = value;
                }
            }
        });
    }, [book]);

    form.submitText = "Update";

    form.buildStateValidators();

    // get image field error state value
    const imageError = form.stateValidators.image.stateValue;

    return (
        <div>

            <CloudinaryHead />
            
            <h1 className={styles.head}>Update Book - {book.title} </h1>

            <form className={styles.bookInfo} onSubmit={bookSubmitEvent(form)} action={form.buildUrl("/books/update/?id=" + book.id)}>

                <ImageWidget error={imageError} defaultImage={imageUrl} />

                <div className={styles.bookDetails + " " + styles.bookForm}>
                    {form.render()}
                </div>

            </form>
        </div>
    );
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    return reuseServerSideProps(context);
}