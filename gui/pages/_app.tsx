import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
  connectorsForWallets,
  wallet,
} from "@rainbow-me/rainbowkit";
import {
  Chain,
  configureChains,
  createClient,
  WagmiConfig,
  chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "../styles/progressBar.css"; //styles of nprogress

const arbiGoerliChain: Chain = {
  id: 421613,
  name: "Arbitrum Goerli",
  network: "arbitrum goerli",
  iconUrl: "https://assets-global.website-files.com/5f973c970bea5548ad4287ef/60a320b472858ace6700df76_arb-icon.svg",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://goerli-rollup.arbitrum.io/rpc/",
  },
  blockExplorers: {
    default: { name: "Arbitrum Explorer", url: "https://goerli-rollup-explorer.arbitrum.io" },
  },
  testnet: false,
};

const { chains, provider, webSocketProvider } = configureChains(
  [arbiGoerliChain],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Suggested',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains }),
      wallet.rainbow({ chains }),
      wallet.coinbase({ appName: 'Solteria', chains }),
      wallet.injected({ chains }),
      wallet.ledger({ chains }),
      wallet.brave({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Solteria</title>
        <meta name="description" content="Solteria" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          
          chains={chains}
          theme={lightTheme({
            accentColor: "#1E2E5F",
            accentColorForeground: "white",
            fontStack: "system",
          })}
        >
          <Navbar />
          <Component {...pageProps} />
          <Footer/>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
