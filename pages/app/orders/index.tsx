import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import NoResult from "../../../components/no-result";
import { getUser } from "../../../src/filebased";
import { Order, OrderSerialized } from "../../../src/models/order";
import { humanizeNumber } from "../../../src/utils";
import styles from "../../../styles/order-list.module.css"

export default function UserOrders({ orders }: { orders: OrderSerialized[] }) {


    const table = () => {
        return (
            <table className="table">
                <thead className={styles.row}>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Amount (₦)</th>
                        <th scope="col">Items</th>
                        <th scope="col">Created</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className={styles.row}>
                    {
                        orders.map((order, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{order.id?.toUpperCase()}</td>
                                <td>₦ {humanizeNumber(order.amount)}</td>
                                <td>{order.items}</td>
                                <td>{order.created}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link href={`/app/orders/${order.id}`} className="btn btn-primary">View</Link>
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
            <h1 className={styles.head}>My Orders</h1>
            {
                orders.length > 0 ? table() : <NoResult text="You have not placed any order yet" />
            }
        </div>
    );
}


export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
    const user = await getUser(req, res);

    const exit = {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };

    if (!user) {
        return exit;
    }

    if (!user.user) {
        return exit;
    }

    const orders = await Order.getByUserIdSerialized(user.user.id);

    return {
        props: {
            orders,
        },
    };
};
