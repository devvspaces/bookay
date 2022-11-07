
import cartStyles from "../../../styles/cart.module.css";
import styles from "../../../styles/checkout.module.css";
import orderStyles from "./orders.module.css";
import { BookItem } from "../../../components/item/types";
import CheckoutItems from "../../../components/checkout/items";


export default function OrderView() {

    const items: BookItem[] = [
        {
            id: "1",
            name: 'Living a Christ Filled Life',
            price: 100,
            isbn: "123456789",
            author: "John Doe",
            image: "/images/book-cover.jpg"
        },
        {
            id: "2",
            name: 'Monomial Patterns in Mathematics',
            price: 100,
            isbn: "123456789",
            author: "John Doe",
            image: "/images/book-cover.jpg"
        },
        {
            id: "3",
            name: 'Design Patterns for Goland Hardware Development',
            price: 100,
            isbn: "123456789",
            author: "John Doe",
            image: "/images/book-cover.jpg"
        },
        {
            id: "4",
            name: 'Design Patterns for Goland Hardware Development',
            price: 100,
            isbn: "123456789",
            author: "John Doe",
            image: "/images/book-cover.jpg"
        }
    ]

    return (
        <div>
            <div className={cartStyles.cartHeader}>
                <h1>Order - 123DFH45deB345</h1>
            </div>

            <CheckoutItems items={items} />


            <div className={styles.checkoutBottom} style={{ justifyContent: "left" }}>

                <div className={orderStyles.summary}>
                    <h2>Order Summary</h2>
                    <div className={styles.orderSummary}>
                        <div>
                            <h5>Subtotal</h5>
                            <p>₦ 400</p>
                        </div>
                        <div>
                            <h5>Shipping</h5>
                            <p>₦ 0</p>
                        </div>

                        <div>
                            <h5>Status</h5>
                            <div>
                                <p>Pending Transit</p>
                                <button className="btn btn-sm btn-outline-primary">Update to In Transit</button>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <h5>Total</h5>
                            <p>₦ 400</p>
                        </div>
                    </div>
                </div>

                <div className={orderStyles.summary}>

                    <h2>Buyer's Info</h2>

                    <div className={styles.orderSummary}>
                        <div>
                            <h5>Full Name</h5>
                            <p>Ayanwola Ayomide Israel</p>
                        </div>

                        <div className={orderStyles.flexed}>

                            <div>
                                <h5>State</h5>
                                <p>Lagos</p>
                            </div>

                            <div>
                                <h5>LGA</h5>
                                <p>Akure</p>
                            </div>

                        </div>

                        <div>
                            <h5>Phone</h5>
                            <p>+2345678909</p>
                        </div>

                        <div>
                            <h5>Address</h5>
                            <p>123, Fake Street, Fake City, Fake State, Fake Country</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}