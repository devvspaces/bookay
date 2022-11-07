import { BookItem } from "../item/types";
import styles from "../../styles/cart.module.css";
import { UserOrderItem } from "./item";

const UserOrderItems = ({ items }: {items: BookItem[]}) => {
    return (
        <div className={styles.cartItems}>
            {items.map((item) => (
                <UserOrderItem key={item.id} item={item}/>
            ))}
        </div>
    );
}

export default UserOrderItems;