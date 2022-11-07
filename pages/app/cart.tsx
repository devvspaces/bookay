import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import CartItems from "../../components/cart/items";
import NoResult from "../../components/no-result";
import { getUser } from "../../src/filebased";
import { _CartItem } from "../../src/models/book";
import { User } from "../../src/models/user";
import { fetchBuilder, humanizeNumber } from "../../src/utils";
import styles from "../../styles/cart.module.css";

export default function Cart({ items }: { items: _CartItem[] }) {

    const total = humanizeNumber(items.reduce((acc, { book }) => acc + (book.price || 0), 0));

    return (
        <div>
            <div className={styles.cartHeader}>

                <h1>My Cart</h1>

                <div className={styles.cartHeadBtns}>
                    {
                        items.length > 0 ?
                            <>
                                <Link href="/app/checkout" className="btn btn-primary">Checkout Cart (₦ {total}) </Link>
                                <a href="" className="btn btn-danger" onClick={
                                    (e) => {
                                        e.preventDefault()

                                        fetchBuilder({
                                            url: "/cart/clear",
                                            method: "delete",
                                            success: () => {
                                                alert("Cart cleared successfully");
                                                window.location.reload();
                                            },
                                        });
                                        
                                    }
                                }>Clear Cart</a>
                            </>
                            : null
                    }
                </div>

            </div>

            {
                items.length > 0 ?
                    <CartItems items={items} />
                    :
                    <NoResult text={"No items in Cart"} textStyles={{ fontSize: "3rem" }} />
            }

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

    const items = await User.serializedUserCart(user?.user?.username as string)

    return {
        props: {
            items
        }
    }

}