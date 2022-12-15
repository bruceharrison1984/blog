import '../styles/globals.css';
import { AppPropsWithComponentWithLayout } from '../types/AppPropsWithLayout';
import Head from 'next/head';

export default function App({
  Component,
  pageProps,
}: AppPropsWithComponentWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const pageTitle = Component.pageTitle || 'NO TITLE';

  return (
    <>
      <Head>
        <title>{`Bruce Lee Harrison - ${pageTitle}`}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#3D4451"></meta>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
