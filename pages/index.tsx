import styles from "../styles/index.module.css";

export default function Home() {
  return (

    <div>

      <h1 className={styles.head}>Get your Tech. & Science Books!</h1>

      <form className={styles.form} action="/search" method="get">

        <input type="text" name="search" className="form-control" id="form_book_name" placeholder="Search for book ..." />
        <button className={styles.button} type="submit">Search</button>

      </form>

    </div>
  )
}
