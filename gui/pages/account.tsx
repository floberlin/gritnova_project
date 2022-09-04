/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Solteria from "../utils/Solteria.json";
import { useAccount, usePrepareContractWrite, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import { ClaimFunds } from "../components/scFunctions/write/claimFunds";
import { create } from "ipfs-http-client";

const nodeIPFS = create({
  host: "magentadao-backend.westeurope.cloudapp.azure.com",
  port: 443,
  protocol: "https",
});

async function GetIPFS(tasks: string | Result | undefined) {
  let ipfs = new Array<JSON>();

  if (tasks !== undefined && tasks !== null) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i] !== "" && tasks[i] !== null && tasks[i] !== undefined) {
        try {
          const source = nodeIPFS.cat(tasks[i]);

          const data = [];
          for await (const chunk of source) {
            data.push(chunk);
          }
          const byteArray = data.toString().split(",");
          var task = "";
          for (let j = 0; j < byteArray.length; j++) {
            task += String.fromCharCode(Number(byteArray[j]));
          }

          ipfs.push(JSON.parse(task));
        } catch (error) {
          console.log(error);
          const source = nodeIPFS.cat(tasks[i]);
          const data = [];
          for await (const chunk of source) {
            data.push(chunk);
          }
          const byteArray = data.toString().split(",");
          var task = "";
          for (let j = 0; j < byteArray.length; j++) {
            task += String.fromCharCode(Number(byteArray[j]));
          }

          ipfs.push(JSON.parse(task));
        }
      }
    }
  } else {
    console.log("No task found");
  }

  return ipfs;
}

const Account: NextPage = () => {
  const { address } = useAccount();

  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4";
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<JSON[]>([]);
  const [task, setTask] = useState<JSON[]>();
  const [reward, setReward] = useState<any>([]);
  const [showChild, setShowChild] = useState(false);

  async function getBalanceReward() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contractAddr = "0x048e3eb0ed956a6e09fc7ffb79e648f8353b1cc4";
    const solteria = new ethers.Contract(contractAddr, Solteria.abi, provider);
    let ipfsArray = new Array();
    let rewardArray = new Array();
    const address = await signer.getAddress();

    for (let i = 0; i < 100; i++) {
      const balance = await (await solteria.balanceOf(address, i)).toString();
      if ((await await balance) !== "0") {
        ipfsArray.push(await solteria.tokenIDtoIPFS(i));
        rewardArray.push(
          ethers.utils.formatEther(
            await (await solteria.tokenIDtoReward(i)).toString()
          )
        );
      }
    }
    return [ipfsArray, rewardArray];
  }

  useEffect(() => {
    getBalanceReward()
      .then(([ipfsArray, rewardArray]) => {
        if (ipfsArray !== undefined && rewardArray !== undefined) {
          setReward(rewardArray);
          setTask(ipfsArray);
          GetIPFS(ipfsArray)
            .then((res) => {
              setData(res);
              setIsLoaded(true);
            })
            .catch((e) => {
              setIsLoaded(false);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">
            Contractor Account Overview
          </div>
          <br />
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Your Ethereum Address</div>
              <div className="stat-value">
                {" "}
                <div className="text-xl font-bold mt-8">{address}</div>
              </div>
            </div>
          </div>

          <div className="stats shadow"></div>

          <br />

          <div className="text-xl font-bold mt-8">
            Your claimed solteria NFTs:
          </div>
          <div className="grid grid-cols-1 gap-4">
            {!isLoaded && <p>loading bounties...</p>}

            {isLoaded && (
              <>
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
                      <div className="badge badge-outline">
                        {item.attributes[0].value}
                      </div>
                      <div className="badge badge-outline badge-success">
                        Reward: {reward[i]}
                      </div>
                      <div className="card-actions justify-end">
                        <ClaimFunds ipfsId={task?.[i]} />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <br />
        </div>
      </main>
    );
  }
};

export default Account;
