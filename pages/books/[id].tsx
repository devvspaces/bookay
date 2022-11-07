import { GetServerSidePropsContext } from "next";
import { cloudName } from "../../components/upload-widget";
import { Book, BookSerialized } from "../../src/models/book";
import { SellerSerialized } from "../../src/models/seller";
import { Cloudinary } from "@cloudinary/url-gen";
import styles from "../../styles/book.module.css";
import TransformImage from "../../components/image";
import { getLoginNextUrl, getNextUrl, isLoggedIn } from "../../src/auth";
import { setCookie } from "cookies-next";
import { fetchBuilder, humanizeNumber } from "../../src/utils";
import { useEffect } from "react";


type SellerBook = {
    seller: SellerSerialized
} & BookSerialized

type Props = {
    book: SellerBook
}

export default function SingleBook({ book }: Props) {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });

    return (

        <div className={styles.bookMain}>

            <div className={styles.bookCover}>
                <TransformImage radius={10} cld={cld} publicId={book.image as string} height={400} width={300} />
            </div>

            <div className={styles.bookOverview}>

                <div className={styles.bookContent}>
                    <h1>{book.title}</h1>

                    <div className={styles.bookInfo}>

                        <div>
                            <h4>Author</h4>
                            <p>{book.author}</p>
                        </div>

                        <div>
                            <h4>ISBN</h4>
                            <p>{book.isbn}</p>
                        </div>

                        <div>
                            <h4>Price</h4>
                            <p>₦ {humanizeNumber(book.price || 0)}</p>
                        </div>

                        <div>
                            <h4>Bookshop</h4>
                            <p>{book.seller.name}</p>
                        </div>

                        <div>
                            <h4>{"Shop's Phone"}</h4>
                            <p>{book.seller.phone}</p>
                        </div>

                        <div>
                            <h4>{"Shop's Address"}</h4>
                            <p>{book.seller.address}</p>
                        </div>

                    </div>

                </div>

                <div className={styles.bookBtns}>
                    <button onClick={
                        () => {
                            if (!isLoggedIn()){
                                window.location.href = getLoginNextUrl()
                                return;
                            }

                            const data = {
                                bookId: book.id,
                            }

                            fetchBuilder({
                                url: "/cart/add",
                                data,
                            })
                        }
                    } >Save to Cart</button>
                    {/* <button>Order</button> */}
                </div>

            </div>


        </div>

    );
}




export const getServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {

    // Get the book id from the url
    const { id } = query;

    // Get the book from the database
    const book = await Book.get(id as string);

    // If the book is not found, redirect to the home page
    if (!book) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {
            book: await book.serializeWithSeller()
        }
    }

}
