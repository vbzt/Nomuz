import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { Barlow } from 'next/font/google'

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '600'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={barlow.variable}>
      <Header />
      <Component {...pageProps} />
    </main>
  );
}
