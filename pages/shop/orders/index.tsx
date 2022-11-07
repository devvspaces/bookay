import { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import NoResult from "../../../components/no-result";
import { getSeller } from "../../../src/filebased";
import { OrderBook } from "../../../src/models/order";
import { humanizeNumber } from "../../../src/utils";
import styles from "../../../styles/order-list.module.css"

type Props = InferGetStaticPropsType<typeof getServerSideProps>

export default function Orders({ orders }: Props) {

    const table = () => {
        return (
            <table className="table">
                <thead className={styles.row}>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Book</th>
                        <th scope="col">Amount (₦)</th>
                        <th scope="col">Items</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className={styles.row}>
                    {
                        orders.map(({ order, book, id }, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{book.title}</td>
                                <td>₦ {humanizeNumber(order.amount || 0)}</td>
                                <td>{order.items}</td>
                                <td>{order.created}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link href={`/shop/orders/${id}`} className="btn btn-primary">View</Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )
    }

    return (
        <div>
            <h1 className={styles.head}>Book Orders</h1>

            {
                orders.length > 0 ? table() : <NoResult text="No order has been placed yet" />
            }


        </div>
    );
}


export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
    const seller = await getSeller(req, res);

    const exit = {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };

    if (!seller || !seller.profile) {
        return exit;
    }

    const orders = await OrderBook.getBySellerIdSerialized(seller.profile.id);

    return {
        props: {
            orders,
        },
    };
};
