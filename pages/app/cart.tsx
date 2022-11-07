import { GetServerSidePropsContext } from "next";
import CartItems from "../../components/cart/items";
import { getUser } from "../../src/filebased";
import { BookSerialized } from "../../src/models/book";
import { User } from "../../src/models/user";
import styles from "../../styles/cart.module.css";

export default function Cart({ books }: { books: BookSerialized[] }) {

    console.log(books)

    return (
        <div>
            <div className={styles.cartHeader}>

                <h1>My Cart</h1>

                <div className={styles.cartHeadBtns}>
                    <a href="" className="btn btn-primary">Checkout Cart (₦ 2,000) </a>
                    <a href="" className="btn btn-danger">Clear Cart</a>
                </div>

            </div>

            <CartItems items={books} />

        </div>
    );
}

export const getServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {

    const user = await getUser(req, res);

    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    const books = await User.serializedUserCart(user?.user?.username as string)

    return {
        props: {
            books
        }
    }

}