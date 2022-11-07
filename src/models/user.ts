import { SelectedPick } from "@xata.io/client";
import { compare } from "bcrypt";
import { hashPassword } from "../filebased";
import { UsersRecord } from "../xata";
import { BaseModel } from "./baseModel";
import { Book } from "./book";
import { Seller } from "./seller";


type UserT =Readonly<SelectedPick<UsersRecord, ["*"]>> | null;


export class User extends BaseModel {

    user: UserT;

    constructor(user: UserT) {
        super();
        this.user = user;
    }

    async checkPassword(password: string) {
        if (!this.user?.password) return false;
        return await compare(password, this.user.password);
    }

    async isSeller(){
        const seller = await this.db().profile.filter({ "user": this.user?.id }).getFirst();
        return seller !== null;
    }

    async profile() {
        const profile = await this.db().profile.filter({ "user": this.user?.id }).getFirst();
        return profile;
    }

    async seller() {
        return new Seller(await this.profile());
    }

    async ownsCartItem(id: string) {
        const item = await this.db().cart.filter({ id, user: this.user?.id }).getFirst();
        return item || false;
    }

    async getCart() {
        return await this.db().cart.filter({ user: this.user?.id }).getAll();
    }

    async clearCart() {
        const cart = await this.getCart();
        for (const key in cart) {
            await cart[key].delete();
        }
    }

    async getCartBooks() {
        const cart = await this.getCart();
        const books: { id: string, book: Book }[] = []
        
        for (const key in cart) {
            const item = cart[key]
            const book = await Book.get(item.book?.id as string)
            books.push({
                id: item.id,
                book
            })
        }

        return books
    }

    static async getUserCart(username: string) {
        const user = await User.getUser(username);
        return await user.getCartBooks();
    }

    static async serializedUserCart(username: string){
        const books = await this.getUserCart(username);
        return books.map(({ id, book }) => {
            return {
                id,
                book: book.serialize()
            }
        })
    }

    static async create(username: string, password: string) {
        const xata_user = await this.db().users.create({ username, password: await hashPassword(password)});
        return new User(xata_user);
    }

    static async getUser(username: string) {
        const xata_user = await this.db().users.filter({ username }).getFirst();
        if (!xata_user) throw new Error("User does not exist");
        return new User(xata_user);
    }

    static async get(id: string) {
        const xata_user = await this.db().users.filter({ id }).getFirst();
        if (!xata_user) throw new Error("User does not exist");
        return new User(xata_user);
    }

    static async login(username: string, password: string) {
        let user: User;

        try{
            user = await this.getUser(username);
        } catch (e) {
            return await this.create(username, password);
        }

        if (await user.checkPassword(password)) {
            return user;
        }
    
        return false;
    }

}