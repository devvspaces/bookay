import { fetchBuilder } from "../../src/utils";
import styles from "../../styles/cart.module.css";
import { ItemDetailBox } from "../item/item";
import { ItemImage } from "../item/item-image";
import { Props } from "../item/types";


export const CartItem = ({ item }: Props) => {
    return (
        <div className={styles.cartItem}>

            <a href="#" className={styles.close} onClick={
                (e) => {
                    e.preventDefault()

                    fetchBuilder({
                        url: "/cart/delete",
                        data: {
                            id: item.id,
                        },
                        method: "delete",
                        success: () => {
                            alert(`${item.book.title} removed successfully`);
                            window.location.reload();
                        },
                    })
                }
            }>x</a>

            <ItemImage item={item} />
            <ItemDetailBox item={item} />

        </div>
    );
}
