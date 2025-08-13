import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import { Barlow } from 'next/font/google'
import { useRouter } from "next/router";


const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '600'],
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  const isDashboardRoute = router.pathname.startsWith('/dashboard')

  return (
    <main className={barlow.variable}>
      {!isDashboardRoute && <Header />}
      <Component {...pageProps} />
    </main>
  );
}
