import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Web3 providers */
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { providers } from "ethers";

/* Components */
import Header from './components/Header';
import Board from './components/Board';
import MyTasks from './components/MyTasks';
import Profile from './components/Profile';

// Required for Ionic 6
setupIonicReact({
  mode: 'md'
});

/* web3 vars */
let { ethereum } = window ;
let provider: providers.Web3Provider | undefined; 
let signer: providers.JsonRpcSigner;
let solteria: any;

if (!ethereum) {
  alert("Please install Metamask or a different web3 provider");
} else {
   // ethereum.on('chainChanged', (_chainId: string) => (this as any).reset());
   // ethereum.on('accountsChanged', (accounts: any) => {(this as any).reset()});
}

 
const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Solteria", // Required
      infuraId: "c4fe7eca7f744d1d83fc99a06ed38c2a", // Required
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: true // Optional. Use dark theme, defaults to false
    }
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "c4fe7eca7f744d1d83fc99a06ed38c2a",
    },
  },
  binancechainwallet: {
    package: true
  }
};

const web3Modal = new Web3Modal({
  network: "polygon-mainnet",
  cacheProvider: true,
  providerOptions: providerOptions,
})  


const App: React.FC = () => {
  return (
    <IonApp>
    {/* Header - start */}
    <Header ethereum={ethereum} web3Modal={web3Modal} provider={provider} signer={signer}></Header>
   {/* Header - end */}
    {/* Main content - start  */}
    <IonContent>
      <div className="ion-padding">
        <h1>Solteria</h1>
        <p>
          A web3-based application for the Polygon blockchain.
        </p>
      </div>
    </IonContent>
    {/* Main content - end  */}

    {/* Routes - start  */}
    <IonReactHashRouter>
        <IonRouterOutlet>
          <Route exact path="/mytasks">
            <Board ethereum={ethereum} web3Modal={web3Modal} provider={provider} signer={signer}/>
          </Route>
          <Route exact path="/board">
            <MyTasks ethereum={ethereum} web3Modal={web3Modal} provider={provider} signer={signer}/>
          </Route>
          <Route exact path="/profile">
            <Profile ethereum={ethereum} web3Modal={web3Modal} provider={provider} signer={signer}/>
          </Route>
          <Route exact path="/">
            <Redirect to="/" />
          </Route>
        </IonRouterOutlet>
    </IonReactHashRouter>
   {/* Routes - end */}

    {/* Footer - start */}   
            {/* tbd */}
    {/* Footer - end */}


  </IonApp>
  );
};

export default App;
