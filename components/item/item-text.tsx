import { Props } from "./types";


export const ItemText = ({ item }: Props) => {
    return (
        <>
            <div>
                <h5>Title</h5>
                <p>{item.title}</p>
            </div>

            <div>
                <h5>Author</h5>
                <p>{item.author}</p>
            </div>

            <div>
                <h5>ISBN</h5>
                <p>{item.isbn}</p>
            </div>

            <div>
                <h5>Price</h5>
                <p>₦ {item.price}</p>
            </div>
        </>
    );
}