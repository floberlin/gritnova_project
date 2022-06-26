import { IonButton, IonInput, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonCard, IonTitle, IonToolbar } from '@ionic/react';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { Contract, providers, utils } from "ethers";
import { useState } from 'react';
import { formatAuthMessage } from "../utils";
import abi from "../abi.json"
import axios from "axios";



import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

let ethereum: any = (window as any).ethereum;
let provider: providers.Web3Provider | undefined; 
let signer: providers.JsonRpcSigner;
let dSalary: any;

ethereum.on('chainChanged', (_chainId: string) => (this as any).reset());
ethereum.on('accountsChanged', (accounts: any) => {(this as any).reset()});

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "dSalary", // Required
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


const Employee: React.FC = () => {

  async function switchToArbitrumRinkeby() {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x66EEB',
          chainName: 'Arbitrum Rinkeby',
          rpcUrls: ['https://rinkeby.arbitrum.io/rpc']
        },
      ],
    });
  }
  
  
  async function switchToGoerli() {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x5',
        },
      ],
    });
  }
  async function switchToPolygonMumbai() {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x13881',
          chainName: 'Polygon Mumbai',
          rpcUrls: ['https://matic-mumbai.chainstacklabs.com']
        },
      ],
    });
  }
  
  
    
  const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions: providerOptions,
    });
  
  const [chainId, setChainId] = useState<number>(1);
  const [address, setAddress] = useState<string>("Connect Wallet");
  const [ipfsCID, setipfsCID] = useState<string>("");
  const [ipfsContent, setipfsContent] = useState<string>("");

  
    
  
  function reset() {
    setAddress("");
    provider = undefined;
    web3Modal.clearCachedProvider();
  }
  
  async function connect() {
    const web3Provider = await web3Modal.connect();
  
    web3Provider.on("disconnect", reset);
  
    const accounts = (await web3Provider.send("eth_requestAccounts", [])) as string[];
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);
  
    const providertemp = new providers.Web3Provider(web3Provider);
    provider = providertemp;
    signer = provider.getSigner();
    const addr = await signer.getAddress();
    dSalary = new Contract("0xDF3047d476C892bB3C8339723aC86Ce570291310", abi, signer);
    return addr;
  }
    
  
  async function _getEmployee() {
    await dSalary.getEmployee()
    .then((result:any) => {alert("You are an Employee!")})
    .catch((error:any) => {alert("You are not an Employee!")});
  }
  
  async function _grantRoleEmployee() {
    await dSalary.grantRoleEmployee()
  }
  
  async function _revokeRoleEmployee() {
    await dSalary.revokeRoleEmployee();
  }
  
  async function _revokeRoleEmployeeExt() {}
  
  
  async function _withdraw() {
    await dSalary.withdraw()
  }
    
  async function _getTokenId() {
    await dSalary.getTokenId()
  
  }
  
  async function _getIPFSHash() {
    await dSalary.getIPFSHash()
  
  }

  async function _getIPFSContent(ipfsCID:string) {
    const resp =
    axios.get(
      'https://dweb.link/ipfs/'+ipfsCID
    ).then((result:any) => {return (result.data.data as string)})
    .catch(error => {return "Not found"})
   return resp;
  }
  

 
async function signMessage() {
  if (!provider) {
    throw new Error("Provider not connected");
  }
  const msg = formatAuthMessage(address, chainId);
  const sig = await provider.send("personal_sign", [msg, address]);
  console.log("Signature", sig);
  console.log("isValid", utils.verifyMessage(msg, sig).toLowerCase ===  address.toLowerCase);
}


  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>dSalary Dashboard | Employee Perspective</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">dSalary Dashboard | Employee Perspective</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      {address !== "Connect Wallet" ? (
        <>
          <IonCard><IonButton onClick={async () => switchToArbitrumRinkeby()}>Switch to Arbitrum Rinkeby</IonButton>
            <IonButton onClick={async () => switchToPolygonMumbai()}>Switch to Polygon Mumbai</IonButton>
            <IonButton onClick={async () => switchToGoerli()}>Switch to Ethereum Goerli</IonButton><br/>
            <IonButton onClick={async () => setAddress(await connect())}>{address}</IonButton>
          <IonButton onClick={signMessage}>Sign Message</IonButton>
          <IonButton onClick={() => {reset();setAddress("Connect Wallet")}}>Disconnect Wallet</IonButton></IonCard>

          <IonCard><IonButton onClick={() => _getEmployee()}>Check Employment Status</IonButton></IonCard>

          
          <IonCard><IonButton onClick={() => {_withdraw()}}>Withdraw your Salary</IonButton></IonCard><br/>
          <IonCard><IonButton onClick={async () => setipfsContent(await _getIPFSContent(ipfsCID))}>Get your work agreements details</IonButton>
          <IonInput value={ipfsCID as any} placeholder="Enter your IPFS CID" onIonChange={e => setipfsCID(e.detail.value!)} clearInput></IonInput></IonCard><br/>
          <IonCard><IonButton onClick={() => _revokeRoleEmployee()}>Quit Job</IonButton></IonCard>
          <IonInput value={ipfsContent as string} clearInput contentEditable="false" placeholder="IPFS Content"></IonInput>
        </>
      ) : (
        <IonButton onClick={async () => setAddress(await connect())}>{address}</IonButton>
      )}
    </IonContent> 
  </IonPage>
  );
};

export default Employee;
