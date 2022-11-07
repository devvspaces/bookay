import Head from "next/head";
import Script from "next/script";

export const CloudinaryHead = () => {
    return (
        <Script
            src="https://widget.Cloudinary.com/v2.0/global/all.js"
            type="text/javascript"
        />
    );
}