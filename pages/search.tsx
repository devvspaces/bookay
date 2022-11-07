import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import BookItem from "../components/book_item";
import NoResult from "../components/no-result";
import { Book, BookSerialized } from "../src/models/book";
import styles from "../styles/search.module.css";


export default function Search({ books }: { books: BookSerialized[] }) {

    const router = useRouter();

    // Get the search query from the URL
    const { search } = router.query;

    // Convert the search query to a string for input into the search bar
    const searchQuery = search as string;

    function showResults() {
        return (
            <div className={styles.books}>

                {
                    books.map((book, index) => (
                        <BookItem key={index} book={book} />
                    ))
                }

            </div>
        )
    }

    return (

        <div>
            <h2 className={styles.search_head}>Search Results - ({books.length}) </h2>

            <form className={styles.form} action="/search" method="get">
                <input type="text" name="search" id="form_book_name" defaultValue={searchQuery} placeholder="Search for book ..." />
                <button className={styles.button} type="submit">Search</button>
            </form>

            <div>

                { books.length > 0 ? showResults() : <NoResult text={`No results found for "${searchQuery}"`} /> }

            </div>
        </div>

    );

}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const { query } = context;

    const { search } = query;

    const books = await Book.search(search as string);

    return {
        props: {
            books
        }
    }

}