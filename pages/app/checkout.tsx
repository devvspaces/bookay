import CheckoutItems from "../../components/checkout/items";
import { BookItem } from "../../components/item/types";
import cartStyles from "../../styles/cart.module.css";
import styles from "../../styles/checkout.module.css";

export default function Checkout() {

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
                <h1>Checkout Cart</h1>
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

                    {/* <legend>Delivery Information</legend> */}

                    <fieldset>
                        <label htmlFor="buyersName">
                            Full Name
                            <input id="buyersName" type="text" className="form-control" />
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="buyersPhone">
                            Phone
                            <input id="buyersPhone" type={"tel"} className="form-control" />
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="buyersState">
                            State
                            <select className="form-select" name="buyersState" ></select>
                        </label>

                        <label htmlFor="buyersLga">
                            LGA
                            <select className="form-select" name="buyersLga" ></select>
                        </label>
                    </fieldset>

                    <fieldset>
                        <label htmlFor="address">
                            Full Address
                            <textarea className="form-control" name="" id="address" cols={30} rows={10}></textarea>
                        </label>
                    </fieldset>

                    <button>Complete Order</button>

                </form>

            </div>

        </div>
    );
}