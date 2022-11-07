import { BookSerialized } from "../src/models/book";
import styles from "../styles/search.module.css";
import TransformImage from "./image";
import { Cloudinary } from "@cloudinary/url-gen";
import { cloudName } from "./upload-widget";
import Link from "next/link";
import { humanizeNumber } from "../src/utils";

export default function BookItem({ book }: { book: BookSerialized }) {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });

    return (
        <Link href={`/books/${book.id}`} className={styles.bookItemLink}>
            <div className={styles.bookItem}>

                <div className={styles.bookImageContainer}>
                    <TransformImage cld={cld} publicId={book.image as string}  width={350} height={350} />
                </div>

                <div className={styles.bookItemInfo}>
                    <div>
                        <h5>Title</h5>
                        <p>{book.title}</p>
                    </div>

                    <div>
                        <h5>Author Name</h5>
                        <p>{book.author}</p>
                    </div>

                    <div>
                        <h5>Price</h5>
                        <p>₦ {humanizeNumber(book.price || 0)}</p>
                    </div>

                    <div>
                        <h5>ISBN</h5>
                        <p>{book.isbn}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}