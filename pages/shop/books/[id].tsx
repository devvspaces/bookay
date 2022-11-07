import { GetServerSidePropsContext } from "next";
import { Cloudinary } from "@cloudinary/url-gen";
import TransformImage from "../../../components/image";
import { getSeller } from "../../../src/filebased";
import { Book, BookSerialized } from "../../../src/models/book";
import styles from "./books.module.css";
import { cloudName } from "../../../components/upload-widget";

export default function Books({ book }: { book: BookSerialized }) {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });

    return (
        <div>
            <h1 className={styles.head}>{book.title} </h1>


            <div className={styles.bookInfo}>

                <div className={styles.bookImage}>
                    <TransformImage publicId={book.image as string} cld={cld} />
                </div>

                <div className={styles.bookDetails}>
                    <div>
                        <h5>Author</h5>
                        <p>{book.author}</p>
                    </div>

                    <div>
                        <h5>ISBN</h5>
                        <p>{book.isbn}</p>
                    </div>

                    <div>
                        <h5>Quantity</h5>
                        <p>{book.quantity}</p>
                    </div>

                    <div>
                        <h5>Added</h5>
                        <p>{book.added}</p>
                    </div>

                    <div>
                        <h5>Price</h5>
                        <p>{book.price}</p>
                    </div>

                    <div className={styles.btns}>

                        <a href="" className="btn btn-secondary disabled">View Orders</a>
                        <a href="" className="btn btn-info">Preview</a>
                        <a href="" className="btn btn-primary">Edit</a>
                        <a href="" className="btn btn-outline-danger">Delete</a>

                    </div>

                </div>

            </div>
        </div>
    );
}



export const getServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {

    // Get the seller
    const seller = await getSeller(req, res);

    const exit = {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    // If the seller is not found, redirect to the login page
    if (!seller) {
        return exit;
    }

    // Get the book id from the url
    const { id } = query;

    // Get the book from the database
    const book = await Book.get(id as string);

    // If the book is not found, redirect to the books page
    if (!book) {
        return {
            redirect: {
                destination: "/shop/books",
                permanent: false
            }
        }
    }

    // Check if seller owns the book
    if (book.book?.seller?.id !== seller.id) {
        return exit;
    }

    return {
        props: {
            book: book.serialize()
        }
    }

}
