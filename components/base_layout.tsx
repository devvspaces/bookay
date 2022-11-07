import { Component } from "react";
import Navbar from "./navbar";

export default function BaseLayout({ children }: {children: any}) {
    return (
        <div>
            <Navbar />

            <div className='container-fluid'>{children}</div>

            <footer>

            </footer>
        </div>
    );
}