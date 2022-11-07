import { SelectedPick } from "@xata.io/client";
import { ProfileRecord } from "../xata";
import { BaseModel } from "./baseModel";
import { User } from "./user";


type ProfileT = Readonly<SelectedPick<ProfileRecord, ["*"]>> | null;

export type SellerSerialized = {
    id: string | undefined;
    name: string | null | undefined;
    phone: string | null | undefined;
    address: string | null | undefined;
    username: string;
}

export class Seller extends BaseModel {

    profile: ProfileT;

    constructor(profile: ProfileT) {
        super();
        this.profile = profile;
    }

    get id() {
        return this.profile?.id;
    }

    get name() {
        return this.profile?.storeName;
    }

    get phone() {
        return this.profile?.phone;
    }

    get address() {
        return this.profile?.address;
    }

    get user() {
        return this.profile?.user;
    }

    get username(): Promise<string> {
        return this.db().users.filter({ id: this.user?.id }).getFirst().then(
            (user) => {
                return user?.username as string;
            }
        )
    }


    async serialize() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            address: this.address,
            user: this.user,
            username: await this.username
        }
    }
    

    static async getProfile(username: string) {
        const profile = await this.db().profile.filter({ user: { username } }).getFirst();
        if (!profile) return null;
        return new Seller(profile);
    }

    static async createAccount(name: string, phone: string, address: string, username: string, password: string) {
        const user = await User.create(username, password);
        if (!user.user) return null;
        try{
            return await this.creatSeller(name, phone, address, user.user.id);
        } catch(e){
            await user.user.delete();
            throw e;
        }
    }

    static async creatSeller(name: string, phone: string, address: string, userId: string) {
        const xata_profile = await this.db().profile.create({
            storeName: name,
            user: userId,
            phone,
            address,
        });
        return new Seller(xata_profile);
    }

}