import '../styles/mvp.css';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import BaseLayout from '../components/base_layout';
import { GetServerSidePropsContext } from 'next';
import { isLoggedIn } from '../src/auth';



export default function App({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />

      {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script> */}
    </BaseLayout>
  );
}
