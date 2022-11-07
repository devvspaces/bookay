
import cartStyles from "../../../styles/cart.module.css";
import styles from "../../../styles/checkout.module.css";
import orderStyles from "./orders.module.css";
import { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import { getSeller } from "../../../src/filebased";
import { OrderBook } from "../../../src/models/order";
import { _CartItem } from "../../../src/models/book";
import { CheckoutItem } from "../../../components/checkout/item";
import { fetchBuilder, humanizeNumber } from "../../../src/utils";

type Props = InferGetStaticPropsType<typeof getServerSideProps>

export default function OrderView({ order: { id, order, book } }: Props) {

    const bookItem = {
        book: book,
        id: id,
    } as _CartItem

    const placeTransit = () => {
        return (
            <button onClick={
                (e) => {
                    e.preventDefault();

                    const confirmDelivered = confirm("Are you sure you want to mark this order as placed on transit?")

                    if (confirmDelivered) {
                        fetchBuilder({
                            url: "/orders/mark-transit",
                            data: { id: order.id as string },
                            success: () => {
                                window.location.reload();
                            },
                        })
                    }
                }
            } className={orderStyles.place_transit + " " + "btn btn-sm btn-primary"}>Placed In-transit</button>
        )
    }

    return (
        <div>
            <div className={cartStyles.cartHeader}>
                <h1>Order - {id?.toUpperCase()}</h1>
            </div>

            <div className={cartStyles.cartItems}>
                <CheckoutItem item={bookItem} />
            </div>


            <div className={styles.checkoutBottom} style={{ justifyContent: "left", marginTop: "5rem" }}>

                <div className={styles.summary}>
                    <h2>Order Summary</h2>
                    <div className={styles.orderSummary}>
                        <div>
                            <h5>Subtotal</h5>
                            <p>₦ {humanizeNumber(book.price || 0)}</p>
                        </div>
                        <div>
                            <h5>Shipping</h5>
                            <p>₦ 0</p>
                        </div>

                        <div>
                            <h5>Status</h5>
                            <div className="d-flex align-items-center">
                                <p>{order.status}</p>
                                { order.status === "Pending Transit" && placeTransit() }
                            </div>
                        </div>

                        <hr />

                        <div>
                            <h5>Total</h5>
                            <p>₦ {humanizeNumber(book.price || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className={orderStyles.summary}>

                    <h2>{"Buyer's Info"}</h2>

                    <div className={styles.orderSummary}>
                        <div className={orderStyles.flexed}>
                            <div>
                                <h5>Full Name</h5>
                                <p>{order.fullname}</p>
                            </div>
                            <div>
                                <h5>Phone</h5>
                                <p>{order.phone}</p>
                            </div>
                        </div>

                        <div className={orderStyles.flexed}>

                            <div>
                                <h5>State</h5>
                                <p>{order.state}</p>
                            </div>

                            <div>
                                <h5>LGA</h5>
                                <p>{order.lga}</p>
                            </div>

                        </div>

                        <div>
                            <h5>Address</h5>
                            <p>{order.address}</p>
                        </div>

                        <div>
                            <h5>Date Ordered</h5>
                            <p>{order.created}</p>
                        </div>
                    </div>
                </div>

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

    // Get the seller
    const seller = await getSeller(req, res);

    // Validate seller, redirect to the login page
    if (!seller || !seller.profile) {
        return exit;
    }

    // Get the order id from the url
    const { id } = query;

    // Get the order-book from the database
    const orderBook = await OrderBook.get(id as string);

    return {
        props: {
            order: await orderBook.serialize(),
        }
    }

}
