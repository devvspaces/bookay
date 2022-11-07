import Head from "next/head";

export const CloudinaryHead = () => {
    return (
        <Head>
            <script
                src="https://widget.Cloudinary.com/v2.0/global/all.js"
                type="text/javascript"
            ></script>
        </Head>
    );
}