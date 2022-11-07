import { BookSerialized } from "../../src/models/book";
import { humanizeNumber } from "../../src/utils";


export const ItemText = ({ item }: { item: BookSerialized }) => {
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
                <p>₦ {humanizeNumber(item.price || 0)}</p>
            </div>
        </>
    );
}