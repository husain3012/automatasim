import type { AppProps } from "next/app";
import "reactflow/dist/style.css";
import "../styles/globals.css";''

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
