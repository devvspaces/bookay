import styles from "../../styles/cart.module.css";
import { ItemDetailBox } from "../item/item";
import { ItemImage } from "../item/item-image";
import { Props } from "../item/types";


export const CartItem = ({ item }: Props) => {
    return (
        <div className={styles.cartItem}>

            <a href="" className={styles.close}>x</a>

            <ItemImage item={item} />
            <ItemDetailBox item={item} />

        </div>
    );
}
