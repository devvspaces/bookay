import Form from "../components/form";
import LoginForm from "../src/forms/login";
import styles from "../styles/login.module.css";

export default function Login() {

    LoginForm.formGroupClassName = styles.formGroup;

    return (
        <div>

            <Form.Form action="/login" className={styles.form} form={LoginForm}>
                <h2>Sign In / Create Account</h2>
            </Form.Form>

        </div>
    );
}