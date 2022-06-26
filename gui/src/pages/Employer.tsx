import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { BigNumber, Contract, providers, utils } from "ethers";
import { useState } from 'react';
import { formatAuthMessage } from "../utils";
import abi from "../abi.json"
import axios from "axios";

//import * as ipfscore from 'ipfs-core';
//import * as ethutil from 'eth-sig-util';
//import * as ethjsutil from 'ethereumjs-util';

import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

let ethereum: any = (window as any).ethereum;
let provider: providers.Web3Provider | undefined; 
let signer: providers.JsonRpcSigner;
let dSalary: any;

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

ethereum.on('chainChanged', (_chainId: string) => (this as any).reset());
ethereum.on('accountsChanged', (accounts: any) => {(this as any).reset()});


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


const Employer: React.FC = () => {

const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: providerOptions,
  });

const [chainId, setChainId] = useState<number>(1);
const [address, setAddress] = useState<string>("Connect Wallet");
const [verified, setVerified] = useState<Boolean>(false);
const [addrInput, setaddrInput] = useState<any>();
const [ipfsInput, setipfsInput] = useState<any>();
const [salaryInput, setsalaryInput] = useState<any>();
const [periodInput, setperiodInput] = useState<any>();
const [valInput, setvalInput] = useState<any>();
const [ipfsHash, setipfs] = useState<any>();



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

async function signMessage() {
  if (!provider) {
    throw new Error("Provider not connected");
  }
  const msg = formatAuthMessage(address, chainId);
  const sig = await provider.send("personal_sign", [msg, address]);
  console.log("Signature", sig);
  console.log("isValid", utils.verifyMessage(msg, sig).toLowerCase ===  address.toLowerCase);
}

async function _grantRoleEmployer() {
  await dSalary.grantRoleEmployer();
};

async function _revokeRoleEmployer() {
  await dSalary.revokeRoleEmployer();
}

async function _getEmployer() {
  await dSalary.getEmployer()
  .then((result:any) => {alert("You are an Employer!")})
  .catch((error:any) => {alert("You are not an Employer!")});
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

async function _createWA(address:any, data: string, salary:any, period:any) {
  const val:string = (salary * period).toString();
  const options = {value: utils.parseEther(val)}
  const config = {
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRFRWMxNjFlOUVCMDFENzEyODhmMEY3ZkVCYzMyMzk2RjFCODhGMTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Mjk2MzM1NDExMiwibmFtZSI6ImRzYWxhcnkifQ.JKspk1CYUK9UTc1dMrEDTfDV53kGouZDIALydzFNc_c` }
};


const bodyParameters = {
   "data": data
};
const cid:any =
    await axios.post(
    'https://api.nft.storage/upload',
    bodyParameters,
    config
).then(( response ) => {
  return(response as any).data.value.cid;
} )
.catch(( error ) => {
  return "error"
})
await dSalary.createWA(address, cid, utils.parseEther(salary), period, options)
return cid;
};


async function _deposit(val:any) {
  const options = {value: utils.parseEther(val)}
  await dSalary.deposit(options)

}

async function _getTokenId() {
  await dSalary.getTokenId()

}

async function _getIPFSHash() {
  await dSalary.getIPFSHash()

}

async function getEncryptKey() {
  let addr = await signer.getAddress();
  let result = await ethereum
    .request({
      method: 'eth_getEncryptionPublicKey',
      params: [addr], 
    })
    .then((result: any) => {
      return result as string;
    })
    .catch((error: any) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        return "We can't encrypt anything without the key.";
      } else {
        return error as string;
      }
    });
  return result as string;
};

// async function ethEncrypt(dataInput: string) {
//   let addr = await signer.getAddress();
//   let encPK = await ethereum
//     .request({
//       method: 'eth_getEncryptionPublicKey',
//       params: [addr], // you must have access to the specified account
//     })
//     .then((result: any) => {
//       return result as string;
//     })
//     .catch((error: any) => {
//       if (error.code === 4001) {
//         // EIP-1193 userRejectedRequest error
//         return "We can't encrypt anything without the key.";
//       } else {
//         return error as string;
//       }
//     });

//   let encryptedMessage = await ethjsutil.bufferToHex(
//     Buffer.from(
//       JSON.stringify(
//         ethutil.encryptSafely(
//           encPK,
//           { data: dataInput },
//           'x25519-xsalsa20-poly1305'
//         )
//       ),
//       'utf8'
//     )
//   );
//   return encryptedMessage;

// };

async function ethDecrypt(content: string) {
  let addr = await signer.getAddress();
  let result: string = await ethereum
    .request({
      method: 'eth_decrypt',
      params: [content, addr],
    })
    .then((decryptedMessage: string) => { return decryptedMessage as string; }
    )
    .catch((error: any) => { return error as string });
  return JSON.parse(result).data;
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>dSalary Dashboard | Employer Perspective</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">dSalary Dashboard | Employer Perspective</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {address !== "Connect Wallet" ? (
          <>
            <IonCard><IonButton onClick={async () => switchToArbitrumRinkeby()}>Switch to Arbitrum Rinkeby</IonButton>
            <IonButton onClick={async () => switchToPolygonMumbai()}>Switch to Polygon Mumbai</IonButton>
            <IonButton onClick={async () => switchToGoerli()}>Switch to Ethereum Goerli</IonButton>
            <br/>
            <IonButton onClick={async () => setAddress(await connect())}>{address}</IonButton>
            {/* <IonButton onClick={signMessage}>Sign Message</IonButton> */}
            <IonButton onClick={() => {reset();setAddress("Connect Wallet")}}>Disconnect Wallet</IonButton></IonCard>
            <IonCard><IonButton onClick={() => _grantRoleEmployer()}>Become an Employer</IonButton> <IonButton onClick={() => _getEmployer()}>Check Status</IonButton></IonCard>
            <IonCard>
            
            <IonInput value={addrInput as any} placeholder="Enter Employee Address" onIonChange={e => setaddrInput(e.detail.value!)} clearInput></IonInput>
            <IonInput value={ipfsInput as any} placeholder="Enter Work Aggreement Details (Stored in IPFS)" onIonChange={e => setipfsInput(e.detail.value!)} clearInput></IonInput>
            <IonInput value={salaryInput as any} placeholder="Enter 30-days rolling Salary in Ether" onIonChange={e => setsalaryInput(e.detail.value!)} clearInput></IonInput>
            <IonInput value={periodInput as any} placeholder="Period of the Contract in Months" onIonChange={e => setperiodInput(e.detail.value!)} clearInput></IonInput>
            <IonButton onClick={async () => setipfs(await _createWA(addrInput, ipfsInput, salaryInput, periodInput))}>Create a Work Contract and send it to your new Employee</IonButton><br/>
            </IonCard>
            <IonCard><IonButton onClick={() => _deposit(valInput)}>Deposit more Funds</IonButton> 
            <IonInput value={valInput as any} placeholder="Enter Amount in Ether" onIonChange={e => setvalInput(e.detail.value!)} clearInput></IonInput></IonCard><br/>
            <br/>
            <br/>
            <IonInput value={ipfsHash as any} clearInput contentEditable="false" placeholder="IPFS CID"></IonInput>
           
          </>
        ) : (
          <IonButton onClick={async () => setAddress(await connect())}>{address}</IonButton>
        )}
      </IonContent> 
    </IonPage>
  );
};

export default Employer;
