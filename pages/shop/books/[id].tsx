import { GetServerSidePropsContext } from "next";
import { Cloudinary } from "@cloudinary/url-gen";
import TransformImage from "../../../components/image";
import { reuseServerSideProps } from "../../../src/filebased";
import { BookSerialized } from "../../../src/models/book";
import styles from "./books.module.css";
import { cloudName } from "../../../components/upload-widget";
import { fetchBuilder, humanizeNumber } from "../../../src/utils";
import Link from "next/link";

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
                    <TransformImage publicId={book.image as string} cld={cld} height={500} width={300} radius={10} />
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
                        <p>₦ {humanizeNumber(book.price || 0)}</p>
                    </div>

                    <div className={styles.btns}>

                        <a href="" className="btn btn-secondary disabled">View Orders</a>
                        
                        <Link href={`/books/${book.id}`} className="btn btn-info">Preview</Link>
                        <Link href={`/shop/books/update/${book.id}`} className="btn btn-primary">Edit</Link>
                        
                        <button

                            onClick={(e) => {
                                fetchBuilder({
                                    url: "/books/delete",
                                    data: {
                                        id: book.id,
                                    },
                                    method: "delete",
                                    success: () => {
                                        alert(`${book.title} deleted successfully`);
                                        window.location.href = "/shop/books";
                                    },
                                })
                            }}

                            className="btn btn-outline-danger">Delete</button>

                    </div>

                </div>

            </div>
        </div>
    );
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    return reuseServerSideProps(context);
}
