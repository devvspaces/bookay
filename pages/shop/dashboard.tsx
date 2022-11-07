import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSeller } from "../../src/filebased";
import { Seller } from "../../src/models/seller";
import styles from "./dashboard.module.css";


type Props = {
    seller: Seller;
};

export default function Dashboard({ seller }: Props) {

    return (
        <div>

            <h1 className={styles.head}>{ "Welcome, " + seller.username }</h1>


            <div className={styles.storeInfo}>

                <div className={styles.storeImage}>
                    <Image src="/images/profile.jpg" alt="" />
                </div>

                <div className={styles.storeDetails}>

                    <div>
                        <h5>Store Name</h5>
                        <p>{ seller.name }</p>
                    </div>

                    <div>
                        <h5>Phone</h5>
                        <p>{ seller.phone }</p>
                    </div>

                    <div>
                        <h5>Address</h5>
                        <p>{ seller.address }</p>
                    </div>

                </div>
            </div>


            <div className={styles.btns}>

                <div>
                    <p>Books</p>
                    <Link href={"/shop/books"} className="btn btn-primary">View</Link>
                </div>

                <div>
                    <p>Orders</p>
                    <a href="" className="btn btn-primary">View</a>
                </div>

                <div>
                    <p>Requests</p>
                    <a href="" className="btn btn-primary">View</a>
                </div>

            </div>


        </div>

    );
}



export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req, res } = context;

    const seller = await (await getSeller(req, res))?.serialize();

    if (!seller) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            seller
        },
    };
};
