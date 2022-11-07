import styles from "../../styles/cart.module.css";
import { UserOrderItem } from "./item";
import { _CartItem } from "../../src/models/book";

const UserOrderItems = ({ items }: {items: _CartItem[]}) => {
    return (
        <div className={styles.cartItems}>
            {items.map((item) => (
                <UserOrderItem key={item.id} item={item}/>
            ))}
        </div>
    );
}

export default UserOrderItems;