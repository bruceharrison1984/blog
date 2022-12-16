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
      </Head>
      <div className={inter.className}>
        <NavbarLayout>
          <Component {...pageProps} />
        </NavbarLayout>
      </div>
    </>
  );
}
