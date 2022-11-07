import styles from "../../../styles/order-list.module.css"

export default function Checkout() {

    const orders = [
        {
            id: "1",
            orderID: '389092003983',
            amount: 4500,
            items: 6,
            created: "November 03, 2022",
            status: "In Transit"
        },
        {
            id: "2",
            orderID: '389092003983',
            amount: 4500,
            items: 6,
            created: "November 03, 2022",
            status: "In Transit"
        },
        {
            id: "3",
            orderID: '389092003983',
            amount: 4500,
            items: 6,
            created: "November 03, 2022",
            status: "In Transit"
        },
    ]

    return (
        <div>
            <h1 className={styles.head}>My Orders</h1>

            <table className="table">
                <thead className={styles.row}>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Amount</th>
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
                                <td>{order.orderID}</td>
                                <td>{order.amount}</td>
                                <td>{order.items}</td>
                                <td>{order.created}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button className="btn btn-primary">View</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    );
}