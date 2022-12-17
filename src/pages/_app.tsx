import '../styles/globals.css';
import 'highlight.js/styles/github.css';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });
import { AppProps } from 'next/app';
import { NavbarLayout } from '@/layouts/NavbarLayout';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bruce Lee Harrison</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#3D4451"></meta>
      </Head>
      <div className={inter.className}>
        <NavbarLayout>
          <Component {...pageProps} />
        </NavbarLayout>
      </div>
    </>
  );
}
