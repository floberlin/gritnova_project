import { IonHeader, IonToolbar, IonTitle, IonButton, IonText} from '@ionic/react';
import './style/Header.css';
import { providers, utils } from "ethers";
import { useState } from 'react';

interface ContainerProps {
  ethereum: any;
  web3Modal: any;
  provider: providers.Web3Provider | undefined;
  signer: providers.JsonRpcSigner;
}

const Header: React.FC<ContainerProps> = ({ ethereum, web3Modal, provider, signer }) => {

  const [chainId, setChainId] = useState<number>(1);
  const [address, setAddress] = useState<string>("Connect Wallet");
  const [balance, setBalance] = useState<string>("");

  async function connect() {
    const web3Provider = await web3Modal.connect();
  
    web3Provider.on("disconnect", reset);
  
    const accounts = (await web3Provider.send("eth_requestAccounts", [])) as string[];
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);
  
    const providertemp = new providers.Web3Provider(web3Provider);
    provider = providertemp;
    signer = provider.getSigner();
    const addr = (await signer.getAddress()).substring(0,5) + "..." + (await signer.getAddress()).substring(39);
    setBalance(utils.formatEther(await signer.getBalance()).toString() + " Matic");
    
    return addr;
  }

  function reset() {
    setAddress("");
    provider = undefined;
    web3Modal.clearCachedProvider();
  }

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle slot="start" className='title'>Solteria</IonTitle> 
        <IonText slot="end">{balance} &nbsp;</IonText>
        <IonButton slot="end" color="dark" onClick={async () => setAddress(await connect())}>{address}</IonButton>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
