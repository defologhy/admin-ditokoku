//  import global  css
import "../styles/globals.css";
import LayoutChildren from "./components/layout";
import Router, { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  switch (router.asPath) {
    case "/auth/login":
      return (
          <Component {...pageProps} />
      )
      break;
  
    default:
      return (
        <LayoutChildren>
          <Component {...pageProps} />
        </LayoutChildren>
      )
      break;
  }
  
}
