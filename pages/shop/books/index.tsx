import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { getSeller } from "../../../src/filebased";
import { Book, BookSerialized } from "../../../src/models/book";
import { deleteURL, fetchBuilder, humanizeNumber } from "../../../src/utils";
import styles from "./books.module.css";

export default function Books(data: { books: BookSerialized[] }) {
    const books = data.books;

    function createTable() {
        return (
            <div className="tableContainer">
                <table className="table">
                    <thead className={styles.row}>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">ISBN</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Added</th>
                            <th scope="col">Price</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className={styles.row}>
                        {books.map((book, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td>{book.quantity}</td>
                                <td>{book.added}</td>
                                <td>₦ {humanizeNumber(book.price || 0)}</td>
                                <td className={styles.bookAction}>
                                    <Link href={`/shop/books/${book.id}`} className="btn btn-sm btn-primary">View</Link>
                                    <Link href={`/shop/books/update/${book.id}`} className="ms-3 btn btn-sm btn-outline-primary">
                                        Edit
                                    </Link>
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
                                                    window.location.reload();
                                                },
                                            })
                                        }}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    function noBooks(){
        return (
            <h1>No Books Found</h1>
        )
    }

    return (
        <div>
            <div className="topHeader">
                <h1>Books</h1>
                <Link href="/shop/books/create" className="btn btn-primary">
                    Add Book
                </Link>
            </div>

            { books.length > 0 ? createTable() : noBooks() }
        </div>
    );
}

export const getServerSideProps = async ({
    req,
    res,
}: GetServerSidePropsContext) => {
    const seller = await getSeller(req, res);

    const exit = {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };

    if (!seller || !seller.profile) {
        return exit;
    }

    const books = await Book.getSellerBooks(seller.profile.id);

    return {
        props: {
            books,
        },
    };
};
