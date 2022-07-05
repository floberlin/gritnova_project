import { IonHeader, IonToolbar, IonTitle, IonButton, IonText} from '@ionic/react';
import './style/Components.css';
import { providers, utils } from "ethers";
import { useState } from 'react';

interface ContainerProps {
  ethereum: any;
  web3Modal: any;
  provider: providers.Web3Provider | undefined;
  signer: providers.JsonRpcSigner;
}

const Board: React.FC<ContainerProps> = ({ ethereum, web3Modal, provider, signer }) => {

  // To be done

  return (
    <></>
  );
};

export default Board;
