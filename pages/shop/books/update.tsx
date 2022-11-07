import styles from "./books.module.css";

export default function Books() {

    const book = {
        id: "1",
        title: "The Power of Your Subconscious Mind",
        author: "Joseph Murphy",
        quantity: 5,
        isbn: "3434332323",
        added: "November 3, 2022",
        updated: "November 3, 2022",
        price: 4500,
        image: "/images/book-cover.jpg"
    }

    return (
        <div>
            <h1 className={styles.head}>Update Book - {book.title} </h1>


            <form className={styles.bookInfo} method="POST">

                <div className={styles.bookImage}>
                    <img src={book.image} alt={book.title} />
                    <button className="btn btn-sm btn-outline-primary">Upload Image</button>
                </div>

                <div className={styles.bookDetails + " " + styles.bookForm}>
                    <div>
                        <h5>Author</h5>
                        <input name="author" type="text" className="form-control" placeholder="John Murphy" value={book.author} />
                    </div>

                    <div>
                        <h5>ISBN</h5>
                        <input name="isbn" type="text" className="form-control" placeholder="34353563535" value={book.isbn} />
                    </div>

                    <div>
                        <h5>Quantity</h5>
                        <input name="quantity" type="number" className="form-control" placeholder="5" value={book.isbn} />
                    </div>

                    <div>
                        <h5>Price (₦) </h5>
                        <input name="price" type="text" className="form-control" placeholder="4500" value={book.price} />
                    </div>

                    <button className={styles.saveBtn}>Update</button>

                </div>

            </form>
        </div>
    );
}