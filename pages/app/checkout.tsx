import { GetServerSidePropsContext } from "next";
import CheckoutItems from "../../components/checkout/items";
import NoResult from "../../components/no-result";
import { getUser } from "../../src/filebased";
import { _CartItem } from "../../src/models/book";
import { User } from "../../src/models/user";
import { humanizeNumber } from "../../src/utils";
import cartStyles from "../../styles/cart.module.css";
import styles from "../../styles/checkout.module.css";
import form from "../../src/forms/checkout";
import Form from "../../components/form";
import { useEffect } from "react";
import { getLGA } from "../../src/states/states";
import { validLgaToState } from "../../src/validators";

export default function Checkout({ items }: { items: _CartItem[] }) {

    form.buildStateValidators();

    useEffect(() => {

        // Set event listener to filter lga options based on state selection
        const stateSelect = document.querySelector("select[name='state']") as HTMLSelectElement;
        const lgaSelect = document.querySelector("select[name='lga']") as HTMLSelectElement;

        stateSelect.addEventListener("change", () => {

            const state = stateSelect.value;

            // Get lga for state
            const lgas = getLGA(state);

            // Remove all options
            lgaSelect.innerHTML = "";

            // Add option zero
            lgaSelect.innerHTML += `<option value="">Select your LGA</option>`;

            // Add new options
            lgas.forEach(lga => {
                const option = document.createElement("option");
                option.value = lga;
                option.innerText = lga;
                lgaSelect.appendChild(option);
            });

        });

    }, [])

    const checkout = () => {

        const total = humanizeNumber(items.reduce((acc, { book }) => acc + (book.price || 0), 0));

        return (
            <>
                <CheckoutItems items={items} />

                <div className={styles.checkoutBottom}>

                    <div className={styles.summary}>
                        <h2>Order Summary</h2>
                        <div className={styles.orderSummary}>
                            <div>
                                <h5>Subtotal</h5>
                                <p>₦ {total}</p>
                            </div>
                            <div>
                                <h5>Shipping</h5>
                                <p>₦ 0</p>
                            </div>

                            <hr />

                            <div>
                                <h5>Total</h5>
                                <p>₦ {total}</p>
                            </div>

                        </div>
                    </div>


                    <form
                        action={form.buildUrl("/orders/checkout")}
                        className={styles.form}
                        onSubmit={
                            (e) => {
                                e.preventDefault();

                                // Validate LGA field
                                const state = (document.querySelector("select[name='state']") as HTMLSelectElement).value;
                                const lga = (document.querySelector("select[name='lga']") as HTMLSelectElement).value;
                                if (lga === "" || !(validLgaToState(state, lga) === undefined)) {
                                    form.stateValidators.lga.setValue("Please select a valid LGA");
                                    return;
                                }
                                form.handleSubmit(e);
                            }
                        }
                    >

                        {form.render()}

                    </form>

                </div>
            </>
        )
    }

    return (
        <div>
            <div className={cartStyles.cartHeader}>
                <h1>Checkout Cart</h1>
            </div>

            {
                items.length > 0 ? checkout() : <NoResult text={"No items to Checkout"} textStyles={{ fontSize: "3rem" }} />
            }

        </div>
    );
}


export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {

    const user = await getUser(req, res);

    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    const items = await User.serializedUserCart(user?.user?.username as string)

    return {
        props: {
            items
        }
    }

}