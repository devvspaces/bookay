import '../styles/mvp.css';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import Script from 'next/script'
import BaseLayout from '../components/base_layout';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous" />
    </BaseLayout>
  );
}
