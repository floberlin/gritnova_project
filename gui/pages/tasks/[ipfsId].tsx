import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ApproveCompletedTask } from '../../components/scFunctions/write/approveCompletedTask';
import { ClaimTask } from '../../components/scFunctions/write/claimTask';
import { ClaimFunds } from '../../components/scFunctions/write/claimFunds';
import { GetStatus } from '../../components/scFunctions/read/getStatus';
import { GetClaimers } from "../../components/scFunctions/read/getClaimers";
import { CompleteTask } from '../../components/scFunctions/write/completeTask';
import { GetReward } from '../../components/scFunctions/read/getReward';
import { GetTokenID } from '../../components/scFunctions/read/getTokenID';
import Solteria from '../../utils/Solteria.json'
import { useNetwork, usePrepareContractWrite } from "wagmi";

interface ipfsData {
  name: string;
  description: string;
  attributes: [{trait_type: string, value: string}];
  image: string;
  external_url: string;
}


async function GetIPFS(ipfsId: string | Result | undefined) {
  const task = await fetch('https://gateway.pinata.cloud/ipfs/' + ipfsId)   
  return task.json();  
  }


function TaskDetail() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'


  const { isError: isErrorEmployer, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'grantRoleEmployer',
  })

  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ipfsData>();
  const router = useRouter();
  const { ipfsId } = router.query;
  const status = GetStatus(ipfsId);
  const claimers = GetClaimers(ipfsId);
  const tokenId = GetTokenID(ipfsId);

  useEffect(() => {
    GetIPFS(ipfsId)
      .then((res) => {
        setData(res);
        setIsLoaded(true);
      })
      .catch((e) => {
        setIsLoaded(false);
        console.log(e);
      });
  });

  
  return (
    <main className="min-h-screen">
    
      <div className="grid justify-items-center">

      <div className="text-2xl font-bold mt-8">Task Details</div>
      {!isLoaded && <p>loading task...</p>}
      
      {isLoaded && (data) && (

        <div className="grid justify-items-center grid-cols-1 gap-4">
        <Image src={data.image} width="200%" height="100%" quality="100" alt="NFT"/>   
      <p>Title: {data.name}</p>
      <p>Description: {data.description}</p>
      <p>Type: {data.attributes[0].value}</p>
      <p>ERC-1155 Token ID: {tokenId}</p>
      <p>Rewards: <GetReward tokenId={tokenId}/></p>
      <p>Status: {status ? "Done" : "Open for Claimers"}</p>

      <ClaimTask ipfsId={ipfsId}/>
      <button className="btn btn-primary" disabled={!isErrorEmployer} onClick={() => (window as any).location = 'mailto:yourmail@domain.com'}>Submit work</button>
      <CompleteTask ipfsId={ipfsId}/>
      <ClaimFunds ipfsId={ipfsId}/>

      

      <div className="text-2xl font-bold mt-8">Claims History</div>
      {claimers?.map((claimer) => ( 
        <div className="grid justify-items-center grid-cols-1 gap-4" key={claimer}>
          <p>Claimer: {claimer}</p>
          <ApproveCompletedTask ipfsId={ipfsId} claimer={claimer}/>
        </div>
          ))}
      

      </div>
      )}
    
      </div>



    </main>
  );
}

export default TaskDetail;
