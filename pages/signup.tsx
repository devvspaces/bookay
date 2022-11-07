import Form from "../components/form";
import form from "../src/forms/signup";
import styles from "../styles/login.module.css";

export default function Login() {

    return (
        <div>

            <Form.Form form={form} action="/signup" className={styles.form}>
                <h2>Create Shop Account</h2>
            </Form.Form>

        </div>
    );
}