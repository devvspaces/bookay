
import cartStyles from "../../../styles/cart.module.css";
import styles from "../../../styles/checkout.module.css";
import { BookItem } from "../../../components/item/types";
import CheckoutItems from "../../../components/checkout/items";
import { getDate } from "../../../src/utils";


export default function OrderView() {

    const genRatingsOptions = () => {
        return [5, 4, 3, 2, 1].map(num => <option key={num} value={num} >{num}</option>)
    }

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


            <div className={styles.checkoutBottom}>

                <div className={styles.summary}>
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
                            <p>In Transit</p>
                        </div>

                        <hr />

                        <div>
                            <h5>Total</h5>
                            <p>₦ 400</p>
                        </div>
                    </div>

                    <h2>Store Info</h2>
                    <div className={styles.orderSummary}>
                        <div>
                            <h5>Name</h5>
                            <p>God's Love Bookshop</p>
                        </div>

                        <div>
                            <h5>Address</h5>
                            <p>Lagos, Nigeria</p>
                        </div>

                        <div>
                            <h5>Phone</h5>
                            <p>+2345678909</p>
                        </div>

                        <div>
                            <h5>Email</h5>
                            <p>sketchers@test.com</p>
                        </div>
                    </div>
                </div>


                <form className={styles.form} action="" method="post">

                    <legend>Order delivered?</legend>

                    <fieldset>
                        <label htmlFor="buyersName">
                            Date Delivered
                            <p style={{ fontSize: "1.1rem", marginTop: ".5rem" }}>{getDate()}</p>
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="deliveryRatings">
                            Rate delivery
                            <select className="form-select" name="deliveryRatings">
                                {genRatingsOptions()}
                            </select>
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="bookRatings">
                            Rate Book's State / Authenticity
                            <select className="form-select" name="bookRatings">
                                {genRatingsOptions()}
                            </select>
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="deliveryComment">
                            Comment
                            <textarea className="form-control" name="" id="deliveryComment" cols={30} rows={10}></textarea>
                        </label>
                    </fieldset>

                    <button>Received Order</button>

                </form>

            </div>

        </div>
    );
}