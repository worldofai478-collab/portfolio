import "../styles/terminal.css"; // ✅ Import global CSS here
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
