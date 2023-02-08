import '../styles/globals.css';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { BackgroundEffect } from '@/components/backgroundEffect/BackgroundEffect';
import { GoogleAnalytics, event } from 'nextjs-google-analytics';
import { Inter } from '@next/font/google';
import { NavbarLayout } from '@/layouts/NavbarLayout';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>bruce lee harrison</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#3D4451"></meta>
      </Head>
      <GoogleAnalytics trackPageViews />
      <BackgroundEffect />
      <div className={inter.className}>
        <NavbarLayout>
          <Component {...pageProps} />
        </NavbarLayout>
      </div>
    </>
  );
}

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}
