import styles from "../../styles/cart.module.css";
import { CartItem } from "./item";
import { BookSerialized } from "../../src/models/book";

const CartItems = ({ items }: {items: BookSerialized[]}) => {

    function noResults(){
        return (
            <div className="noResults">
                <h3>No items in cart</h3>
            </div>
        )
    }

    function getResults(){
        return (
            <div className={styles.cartItems}>
                {items.map((item) => (
                    <CartItem key={item.id} item={item}/>
                ))}
            </div>
        )
    }

    return (
        items.length > 0 ? getResults() : noResults()
    );
}

export default CartItems;
