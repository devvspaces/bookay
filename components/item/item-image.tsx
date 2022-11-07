import styles from "../../styles/cart.module.css";
import { Cloudinary } from "@cloudinary/url-gen";
import { Props } from "./types";
import { cloudName } from "../upload-widget";
import TransformImage from "../image";

export const ItemImage = ({ item }: Props) => {

    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: cloudName
        }
    });

    return (
        <div className={styles.cartItemImage}>
            <TransformImage radius={10} cld={cld} height={400} width={300} publicId={item.book.image as string} />
        </div>
    );
}