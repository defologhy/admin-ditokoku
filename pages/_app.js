//  import global  css
import "../styles/globals.css";
// import layout  components form components folder
import LayoutChildren from "./components/layout";
export default function MyApp({ Component, pageProps }) {
  return (
    <LayoutChildren>
      <Component {...pageProps} />;
    </LayoutChildren>
  );
}
