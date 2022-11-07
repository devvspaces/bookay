import { SelectedPick } from "@xata.io/client";
import { Dict, readableDate } from "../utils";
import { OrderRecord, OrderBookRecord } from "../xata";
import { BaseModel } from "./baseModel";
import { Book } from "./book";
import { Seller } from "./seller";
import { User } from "./user";


type OrderT = Readonly<SelectedPick<OrderRecord, ["*"]>> | null;


export type OrderSerialized = {
    [key: string]: any;
    id: string | undefined;
    created: string;
    fullname: string | null | undefined;
    phone: string | null | undefined;
    state: string | null | undefined;
    lga: string | null | undefined;
    address: string | null | undefined;
    status: string | null | undefined;
}


export class Order extends BaseModel {

    order: OrderT;

    status: Dict = {
        "pending_transit": "Pending Transit",
        "in_transit": "In Transit",
        "delivered": "Delivered",
    }

    getStatus(status: string) {
        if (status in this.status) return this.status[status];
        return "-";
    }

    constructor(order: OrderT) {
        super();
        this.order = order;
    }

    static async get(id: string) {
        const obj = await this.db().order.filter({ id }).getFirst();
        if (!obj) throw new Error("Order not found");
        return new Order(obj);
    }

    async getBooks() {
        const orderBooks = await this.db().orderBook.filter({ order: this.order?.id }).getAll();

        return await Promise.all(orderBooks.map(async (orderBook) => {
            const book = await Book.get(orderBook.book?.id as string);
            return book
        }));
    }

    async getBooksSerialized() {
        const books = await this.getBooks();
        return books.map((book) => book.serialize());
    }

    async markAsInTransit() {
        if (!this.order) throw new Error("Order not found");
        await this.order.update({ status: "in_transit" });
    }

    async markAsDelivered() {
        if (!this.order) throw new Error("Order not found");
        await this.order.update({ status: "delivered" });
    }

    static async getOrdersByUserID(userId: string) {
        const orders = await this.db().order.filter({ user: userId }).getAll();
        return orders.map((order) => new Order(order));
    }

    static async getByUserIdSerialized(userId: string) {
        const orders = await this.getOrdersByUserID(userId);
        return orders.map((order) => order.serialize());
    }

    serialize() {
        return {
            id: this.order?.id,
            created: readableDate(this.order?.created),
            fullname: this.order?.fullname,
            phone: this.order?.phone,
            state: this.order?.state,
            lga: this.order?.lga,
            address: this.order?.address,
            status: this.getStatus(this.order?.status || ""),
            amount: this.order?.amount,
            items: this.order?.items,
            user: this.order?.user?.id,
        }
    }

    async addOrderBooks(books: Book[]) {
        const orderBooks: OrderBook[] = [];
        try {
            for (const key in books) {
                const book = books[key];
                const orderBook = await OrderBook.create(book, this)
                orderBooks.push(orderBook);
            }
        } catch (error) {
            orderBooks.forEach(async (item) => await item.orderBook?.delete());
            throw error;
        }
        return orderBooks;
    }

    static async checkout(data: {}, user: User) {
        // Check if user has a cart
        const books = (await user.getCartBooks()).map((book) => book.book);
        if (books.length === 0) throw new Error("Cart is empty");

        let order: Order | null = null;
        let orderBooks: OrderBook[] = [];

        let amount = books.reduce((acc, { book }) => acc + (book?.price || 0), 0);

        const orderData = {
            ...data,
            amount,
            items: books.length,
            status: "pending_transit",
        }

        try {
            order = await Order.create(orderData, user);
            orderBooks = await order.addOrderBooks(books);
            await user.clearCart();
            return order;
        } catch (error) {
            if (order) await order.order?.delete();
            orderBooks.forEach(async (item) => await item.orderBook?.delete());
            throw error;
        }

    }

    static async create(orderData: {}, user: User) {
        if (!user.user) throw new Error("User not found");

        const created = new Date();

        const obj = await this.db().order.create({ ...orderData, created, user: user.user.id });
        return new Order(obj);
    }

}


type OrderBookT = Readonly<SelectedPick<OrderBookRecord, ["*"]>> | null;


export class OrderBook extends BaseModel {

    orderBook: OrderBookT;

    constructor(orderBook: OrderBookT) {
        super();
        this.orderBook = orderBook;
    }

    static async get(id: string) {
        const obj = await this.db().orderBook.filter({ id }).getFirst();
        if (!obj) throw new Error("Order not found");
        return new OrderBook(obj);
    }

    static async create(book: Book, order: Order) {
        if (!book.book) throw new Error("Book not found");
        if (!order.order) throw new Error("Order not found");

        const obj = await this.db().orderBook.create({ book: book.book.id, order: order.order.id });
        return new OrderBook(obj);
    }

    async bookSerialize() {
        if (!this.orderBook) throw new Error("Order not found");
        const book = await Book.get(this.orderBook.book?.id as string);
        return book.serialize();
    }

    async orderSerialize() {
        if (!this.orderBook) throw new Error("Order not found");
        const order = await Order.get(this.orderBook.order?.id as string);
        return order.serialize();
    }

    async serialize() {
        return {
            id:  this.orderBook?.id,
            book: await this.bookSerialize(),
            order: await this.orderSerialize(),
        }
    }

    static async getOrdersBySellerID(sellerID: string) {
        const orders = await this.db().orderBook.filter("book.seller.id", sellerID).getAll();
        return orders.map((order) => new OrderBook(order));
    }

    static async getBySellerIdSerialized(sellerID: string) {
        const orders = await this.getOrdersBySellerID(sellerID);
        return Promise.all(orders.map((order) => order.serialize()));
    }

}