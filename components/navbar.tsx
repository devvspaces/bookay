import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isLoggedIn, isSellerLoggedIn } from "../src/auth";

export default function Navbar() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [isSeller, setLoggedSeller] = useState(false);

    useEffect(() => isLoggedIn() ? setLoggedIn(true) : setLoggedIn(false), [])
    useEffect(() => isSellerLoggedIn() ? setLoggedSeller(true) : setLoggedSeller(false), [])

    const router = useRouter();

    useEffect(() => {
        const path = window.location.pathname;

        // Get all nav links
        const navLinks = document.querySelectorAll(".nav-link");

        // Remove active class from all nav links
        navLinks.forEach((link) => {
            link.classList.remove("active");
        });

        // Add active class to current page
        const currentPage = document.querySelector(`.nav-link[href='${path}']`);
        currentPage?.classList.add("active");

    }, [router]);


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">Bookay</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" href="/">Search</Link>
                        </li>

                        {
                            loggedIn ? (
                                <>

                                    {
                                        isSeller ? (
                                            <>
                                                <li className="nav-item">
                                                    <Link className="nav-link" href="/shop/dashboard">Dashboard</Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" href="/shop/orders">Orders</Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link className="nav-link" href="/shop/books">Books</Link>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )
                                    }

                                    <li className="nav-item">
                                        <Link className="nav-link" href="/app/cart">Cart</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/logout" className="nav-link text-danger">Logout</Link>
                                    </li>

                                </>
                            ) : (
                                <>

                                    <li className="nav-item">
                                        <Link href="/login" className="nav-link">Login</Link>
                                    </li>

                                </>
                            )
                        }


                    </ul>
                </div>
            </div>
        </nav>
    );
}