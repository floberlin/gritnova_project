/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Solteria from '../utils/Solteria.json'
import { useAccount, usePrepareContractWrite, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import { ClaimFunds } from "../components/scFunctions/write/claimFunds";
import { ethToEvmos } from "@tharsis/address-converter";

async function GetIPFS(tasks: string | Result | undefined) {
  let ipfs = new Array<JSON>;

  if (tasks !== undefined && tasks !== [] && tasks !== null && tasks.length !== undefined) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i] !== '' && tasks[i] !== null && tasks[i] !== undefined) {
        const task = await fetch('https://gateway.pinata.cloud/ipfs/' + tasks[i])
        ipfs.push(await task.json());

      }
    }
  } else {
    console.log("No task found");
  }

  return ipfs;

}

const Account: NextPage = () => {
  const { address } = useAccount()

  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const [status, setStatus] = useState("Not Verified KYC/KYB - Become Verified:");
  const [disabled, setDisabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<JSON[]>([]);
  const [task, setTask] = useState<JSON[]>([]);
  const [reward, setReward] = useState<any>([]);


  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleEmployer",
  });

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleContractor",
  });

  async function getBalanceReward() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"
      const solteria = new ethers.Contract(contractAddr, Solteria.abi, provider);
      const ipfsArray: any = [];
      const rewardArray: any = [];
      const address = await signer.getAddress();
      for (let i = 0; i < 1000; i++) {

        const balance = await solteria.balanceOf(address, i)



        if (balance?.toString() !== "0") {
          ipfsArray.push(await solteria.tokenIDtoIPFS(i))
          rewardArray.push(ethers.utils.formatEther(await (await solteria.tokenIDtoReward(i)).toString()));
        }

        return [ipfsArray, rewardArray]
      }
    } catch (error) {
      console.log(error)
      return [[], []];
    }

  }

  useEffect(() => {
    if (task === undefined && data === undefined) {

    } else {
      GetIPFS(task)
        .then((res) => {
          setData(res);
          setIsLoaded(true)
        })
        .catch((e) => {
          setIsLoaded(false);
          console.log(e);
        })
    }
  }, [task, data, isLoaded]);

  useEffect(() => {
    getBalanceReward().then(([ipfsArray, rewardArray]) => {
      if (ipfsArray !== undefined && rewardArray !== undefined) {
        setTask(ipfsArray);
        setReward(rewardArray);
        (window.ethereum as any).on('accountsChanged', () => { ((window as any).location.reload()) })
      }
    })
  });

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);


  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">{isErrorContractor && !isErrorEmployer ? "Employer" : "Contractor"} Account Overview</div>
          <br />
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Your Ethereum Address</div>
              <div className="stat-value"> <div className="text-xl font-bold mt-8">{address}</div></div>
            </div>
            <div className="stat">
              <div className="stat-title">Your Cosmos Address</div>
              <div className="stat-value"><div className="text-xl font-bold mt-8">{ethToEvmos(String(address))}</div></div>
            </div>
          </div>

          <div className="stats shadow">

          </div>


          <br />

          {(!isLoaded && isErrorContractor) && <p>loading tasks...</p>}

          {(isLoaded && !isErrorContractor) && (
            <><div className="text-xl font-bold mt-8">Your claimed solteria NFTs:</div><div className="grid grid-cols-1 gap-4">
              {data.map((item: any, i: number) => (
                <div
                  className="card card-bordered card-compact w-96 bg-base-100 shadow-xl border-10px border-base-200 rounded-lg"
                  key={i}
                >
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{item.name}</h2>
                    <p>{item.description}</p>
                    <div className="badge badge-outline">{item.attributes[0].value}</div>
                    <div className="badge badge-outline badge-success">Reward: {reward[i]}</div>
                    <div className="card-actions justify-end">


                      <ClaimFunds ipfsId={task[i]} />
                    </div>
                  </div>
                </div>
              )
              )}
            </div></>
          )}
          <br />
        </div>
      </main>
    );
  }
};

export default Account;
