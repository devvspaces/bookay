import Head from "next/head";
import form from "../../../src/forms/books";
import ImageWidget from "../../../components/upload-widget";
import styles from "./books.module.css";


export default function Books() {

    form.buildStateValidators();

    // get image field error state value
    const imageError = form.stateValidators.image.stateValue;

    return (
        <div>

            <Head>
                <script
                    src="https://widget.Cloudinary.com/v2.0/global/all.js"
                    type="text/javascript"
                ></script>
            </Head>


            <h1 className={styles.head}>Add New Book</h1>

            <form className={styles.bookInfo} onSubmit={(e) => {
                e.preventDefault();
                
                // Get src from image widget
                const imagePublicID = document.querySelector("img")?.getAttribute("data-public-id");
                
                // Set image input field value
                const target = e.target as HTMLFormElement;
                const imageInput = target.querySelector("input[name='image']") as HTMLInputElement;
                imageInput.value = imagePublicID || "";

                form.handleSubmit(e);

            }} action={form.buildUrl("/books/create")}>

                <ImageWidget error={imageError} />

                <div className={styles.bookDetails + " " + styles.bookForm}>
                    {form.render()}
                </div>

            </form>
        </div>
    );
}