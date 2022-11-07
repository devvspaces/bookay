import styles from "./books/books.module.css";

export default function Books() {

    const profile = {
        storeName: "John Doe",
        phone: "123-456-7890",
        address: "123 Main St",
        description: "Store Description",
        image: "/images/profile.jpg"
    }

    return (
        <div>
            <h1 className={styles.head}>Store Profile</h1>


            <form className={styles.bookInfo} method="POST">

                <div className={styles.bookImage}>
                    <img src={profile.image} alt={profile.storeName} />

                    <button className="btn btn-sm btn-outline-primary">Upload Image</button>
                </div>

                <div className={styles.bookDetails + " " + styles.bookForm}>
                    <div>
                        <h5>Store Name</h5>
                        <input name="storeName" type="text" className="form-control" placeholder="John Murphy" value={profile.storeName} />
                    </div>

                    <div>
                        <h5>Phone</h5>
                        <input name="phone" type="text" className="form-control" placeholder="34353563535" value={profile.phone} />
                    </div>

                    <div>
                        <h5>Address</h5>
                        <textarea name="address" className="form-control" id="" cols={30} rows={3}>{profile.address}</textarea>
                    </div>

                    <button className={styles.saveBtn}>Update</button>

                </div>

            </form>
        </div>
    );
}