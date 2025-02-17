import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
// import Script from 'next/script';
// import { useRouter } from 'next/router';
// import { GA_TRACKING_ID, pageview } from '@/lib/gtag';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.sass';

const Noto = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['cyrillic'],
});

const Happiness = localFont({
  src: './fonts/HappinessSansVF.woff2',
  style: 'normal',
  variable: '--happiness',
});

const Square = localFont({
  src: './fonts/NanumSquareNeoVF.woff2',
  style: 'normal',
  variable: '--square',
});

export default function App({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     pageview(url);
  //   };
  //   router.events.on('routeChangeComplete', handleRouteChange);
  //   router.events.on('hashChangeComplete', handleRouteChange);
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //     router.events.off('hashChangeComplete', handleRouteChange);
  //   };
  // }, [router.events]);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      {/* <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script> */}
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          select,
          textarea {
            font-family: ${Noto.style.fontFamily}, sans-serif;
            font-weight: 400;
          }
        `}
      </style>
      <div className={`${Happiness.variable} ${Square.variable}`}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}
