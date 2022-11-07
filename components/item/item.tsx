import Link from "next/link";
import styles from "../../styles/cart.module.css";
import { ItemText } from "./item-text";
import { Props } from "./types";

export const ItemDetailBox = ({ item }: Props) => {
    return (
        <div className={styles.cartItemDetail}>

            <ItemText item={item.book} />

            <Link className="btn btn-sm btn-primary" href={`/books/${item.book.id}`}>View</Link>

        </div>
    );
}