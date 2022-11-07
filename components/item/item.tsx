import styles from "../../styles/cart.module.css";
import { ItemText } from "./item-text";
import { Props } from "./types";

export const ItemDetailBox = ({ item }: Props) => {
    return (
        <div className={styles.cartItemDetail}>

            <ItemText item={item} />

        </div>
    );
}