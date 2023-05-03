import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>Musimetrics - Your Spotify Stats</title>
      <link rel="icon" type="image/x-icon" href="/favicon (2).ico" />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon (2).ico" />
      <meta name="description" content="View your Top Artists and Songs in Spotify" />
      <body >
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
        />

        <Script id="ga-script" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
        `}
        </Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
