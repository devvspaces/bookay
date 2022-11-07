import { _CartItem } from "../../src/models/book";

export type BookItem = {
    id: string;
    name: string;
    price: number;
    isbn: string,
    author: string,
    image: string
};

export interface Props {
    item: _CartItem;
}
