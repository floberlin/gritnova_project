import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, createClient, WagmiConfig, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '../components/navbar';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '../styles/progressBar.css'; //styles of nprogress

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.polygonMumbai,
    chain.polygon,
  ],
  [
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Solteria',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());  


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-theme="solteria">
      <Head>
        <title>Solteria</title>
        <meta
          name="description"
          content="Solteria"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Navbar/>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
    
  );
}

export default MyApp;
