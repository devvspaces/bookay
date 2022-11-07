import { useState } from "react";
import styles from "../pages/shop/books/books.module.css";

export const cloudName = "dsnipmmnj";
const uploadPreset = "cpddktgo";

const ImageWidget = ({ error, defaultImage = "/images/add-image.png" }: { error: string, defaultImage?: string }) => {
    const [preview, setPreview] = useState(defaultImage);
    const [imageId, setImageID] = useState("");

    const openWidget = (e: any) => {
        e.preventDefault();

        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: cloudName,
                uploadPreset: uploadPreset
            },
            // @ts-ignore
            (error, result) => {
                if (!error && result && result.event === "success") {
                    setPreview(result.info.secure_url)
                    setImageID(result.info.public_id)
                }
            }
        );
        widget.open(); // open up the widget after creation
    };


    return (
        <div className={styles.bookImage}>
            <img src={preview} data-public-id={imageId} alt="" />
            <button onClick={openWidget} className="btn btn-sm btn-outline-primary">Upload Image</button>
            {error && <p className="form-error text-center">{error}</p>}
        </div>
    );
}

export default ImageWidget;