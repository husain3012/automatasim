import type { AppProps } from "next/app";
import "reactflow/dist/style.css";
import "../styles/globals.css";
("");
import { RecoilRoot } from "recoil";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
