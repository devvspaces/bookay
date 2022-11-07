import styles from "../../styles/cart.module.css";
import { ItemDetailBox } from "../item/item";
import { ItemImage } from "../item/item-image";
import { Props } from "../item/types";


export const CheckoutItem = ({ item }: Props) => {
    return (
        <div className={styles.cartItem}>
            <ItemImage item={item} />
            <ItemDetailBox item={item} />
        </div>
    );
}
