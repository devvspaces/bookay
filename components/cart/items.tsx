import styles from "../../styles/cart.module.css";
import { CartItem } from "./item";
import { BookSerialized, _CartItem } from "../../src/models/book";

const CartItems = ({ items }: {items: _CartItem[]}) => {

    function getResults(){
        return (
            <div className={styles.cartItems}>
                {items.map((item) => (
                    <CartItem key={item.id} item={item}/>
                ))}
            </div>
        )
    }

    return getResults();
}

export default CartItems;
