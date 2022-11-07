import styles from "../../styles/cart.module.css";
import { CheckoutItem } from "./item";
import { _CartItem } from "../../src/models/book";

const CheckoutItems = ({ items }: {items: _CartItem[]}) => {
    return (
        <div className={styles.cartItems}>
            {items.map((item) => (
                <CheckoutItem key={item.id} item={item}/>
            ))}
        </div>
    );
}

export default CheckoutItems;
