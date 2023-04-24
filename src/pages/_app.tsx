import '@/styles/globals.css'
import { AppProps } from "next/app";
import AppBar from "./appbar";
import Footer from "./footer";
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps,
}: AppProps) {
  const { session, ...restPageProps } = pageProps

  return (
    <SessionProvider session={session}>
      <div className="h-full dark">
      <AppBar/>
        <div style={{ paddingTop: '64px' }}>
          <Component {...restPageProps} />
        </div>
      </div>
      <Footer/>
    </SessionProvider>
  )
}