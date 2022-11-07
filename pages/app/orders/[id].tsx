
import cartStyles from "../../../styles/cart.module.css";
import styles from "../../../styles/checkout.module.css";
import CheckoutItems from "../../../components/checkout/items";
import { fetchBuilder, getDate, humanizeNumber } from "../../../src/utils";
import { GetServerSidePropsContext } from "next";
import { getUser } from "../../../src/filebased";
import { Order, OrderSerialized } from "../../../src/models/order";
import { BookSerialized, _CartItem } from "../../../src/models/book";


export default function OrderView({ items, order }: { items: BookSerialized[], order: OrderSerialized }) {

    const wrapBooks: _CartItem[] = items.map((item, index) => {
        return {
            book: item,
            id: index.toString(),
        }
    })

    const deliverButton = () => {
        return (
            <button onClick={
                (e) => {
                    e.preventDefault();

                    const confirmDelivered = confirm("Are you sure you want to mark this order as delivered ?")

                    if (confirmDelivered) {
                        fetchBuilder({
                            url: "/orders/mark-deliverd",
                            data: { id: order.id as string },
                            success: () => {
                                window.location.reload();
                            },
                        })
                    }
                }
            } className="mt-1">Received Order</button>
        )
    }

    const form = () => {
        return (
            <form className={styles.form} action="" onSubmit={(e) => {
                e.preventDefault();
            }}>

                <legend>Order delivered ?</legend>

                <div>
                    <label htmlFor="buyersName">
                        Date Delivered
                        <p style={{ fontSize: "1.1rem", marginTop: ".5rem" }}>{getDate()}</p>
                    </label>
                </div>

                { deliverButton() }

            </form>
        )
    }

    const total = humanizeNumber(wrapBooks.reduce((acc, { book }) => acc + (book.price || 0), 0));

    return (
        <div>
            <div className={cartStyles.cartHeader}>
                <h1>Order - {order.id?.toUpperCase()}</h1>
            </div>

            <CheckoutItems items={wrapBooks} />


            <div className={styles.checkoutBottom}>

                <div className={styles.summary}>
                    <h2>Order Summary</h2>
                    <div className={styles.orderSummary}>
                        <div>
                            <h5>Subtotal</h5>
                            <p>₦ {total}</p>
                        </div>
                        <div>
                            <h5>Shipping</h5>
                            <p>₦ 0</p>
                        </div>

                        <div>
                            <h5>Status</h5>
                            <p>{order.status}</p>
                        </div>

                        <hr />

                        <div>
                            <h5>Total</h5>
                            <p>₦ {total}</p>
                        </div>
                    </div>
                </div>


                { order.status === "In Transit" && form() }

            </div>

        </div>
    );
}



export const getServerSideProps = async ({ req, res, query }: GetServerSidePropsContext) => {

    const exit = {
        redirect: {
            destination: "/",
            permanent: false
        }
    }

    // Get the user
    const user = await getUser(req, res);

    // If user is not logged in
    if (!user) {
        return exit;
    }

    // Get the order id from the url
    const { id } = query;

    // Get the order from the database
    const order = await Order.get(id as string);

    // Get Book items of the order
    const items = await order.getBooksSerialized();

    return {
        props: {
            order: order.serialize(),
            items
        }
    }

}
