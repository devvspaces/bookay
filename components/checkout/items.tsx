import { BookItem } from "../item/types";
import styles from "../../styles/cart.module.css";
import { CheckoutItem } from "./item";

const CheckoutItems = ({ items }: {items: BookItem[]}) => {
    return (
        <div className={styles.cartItems}>
            {items.map((item) => (
                <CheckoutItem key={item.id} item={item}/>
            ))}
        </div>
    );
}

export default CheckoutItems;
