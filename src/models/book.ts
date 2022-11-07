import { SelectedPick } from "@xata.io/client";
import { readableDate } from "../utils";
import { BooksRecord, getXataClient } from "../xata";
import { BaseModel } from "./baseModel";
import { Seller } from "./seller";


type BookT = Readonly<SelectedPick<BooksRecord, ["*"]>> | null;

export type BookSerialized = {
    id: string;
    title: string | null | undefined;
    isbn: string | null | undefined;
    author: string | null | undefined;
    price: number | null | undefined;
    quantity: number | null | undefined;
    added: string | null | undefined;
    updated: string | null | undefined;
    image: string | null | undefined;
}
    

export class Book extends BaseModel {

    book: BookT;

    // NOTE: Connect seller object to book object

    constructor(book: BookT) {
        super();
        this.book = book;
    }

    static async get(id: string) {
        const xata_book = await this.db().books.filter({ id }).getFirst();
        if (!xata_book) throw new Error("Book not found");
        return new Book(xata_book);
    }

    static async search(query: string) {
        const xata = getXataClient();
        const xata_books = await xata.search.all(query, {
            tables: ["books"],
        });
        return xata_books.map(book => new Book(book.record).serialize());
    }

    static async addToCart(bookId: string, userId: string) {
        await Book.get(bookId)

        // Check if book is available in users cart already
        const inCart = await this.db().cart.filter({ book: bookId, user: userId }).getFirst() === null;

        if (!inCart) return

        await this.db().cart.create({ book: bookId, user: userId })
    }

    static async update(id: string, bookData: {}) {
        const xata_book = await this.db().books.filter({ id }).getFirst();
        if (!xata_book) throw new Error("Book not found");

        const updated_book = await xata_book.update({ ...bookData, updated: new Date() });
        return new Book(updated_book);
    }

    async seller(){
        const seller_id = this.book?.seller?.id;
        const seller = await this.db().profile.filter({ id: seller_id }).getFirst();

        if (!seller) throw new Error("Book has no seller");

        return new Seller(seller);
    }


    async serializeWithSeller(){

        const sellerData = await (await this.seller()).serialize();
        const bookData = this.serialize();

        return {
            ...bookData,
            seller: {
                ...sellerData
            }
        }

    }

    serialize() {
        return {
            id: this.book?.id,
            title: this.book?.title,
            isbn: this.book?.isbn,
            author: this.book?.author,
            quantity: this.book?.quantity,
            price: this.book?.price,
            added: readableDate(this.book?.added),
            updated: readableDate(this.book?.updated),
            image: this.book?.image,
        }
    }

    static async getSellerBooks(seller_id: string) {
        const xata_books = await this.db().books.filter({ seller: seller_id }).getAll();
        return xata_books.map(book => new Book(book).serialize());
    }

    static async create(bookData: {}, seller: Seller) {
        if (!seller) throw new Error("Seller not found");
        if (!seller.profile) throw new Error("Seller profile not found");

        const added = new Date();
        const updated = added;

        const xata_book = await this.db().books.create({ ...bookData, added, updated, seller: seller.profile?.id });
        return new Book(xata_book);
    }

}