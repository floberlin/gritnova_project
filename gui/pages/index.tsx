import type { NextPage } from "next";
import Link from "next/link";
import { useContractRead, useNetwork, usePrepareContractWrite } from "wagmi";
import Solteria from "../utils/Solteria.json";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import { GetReward } from "../components/scFunctions/read/getReward";
import { DeleteTask } from "../components/scFunctions/write/deleteTask";
import { create } from "ipfs-http-client";

const nodeIPFS = create({
  host: "magentadao-backend.westeurope.cloudapp.azure.com",
  port: 443,
  protocol: "https",
});

async function GetIPFS(tasks: string | Result | undefined) {
  let solteriaArray = [];
  let tokenIdArray = [];

  let ipfs = new Array<JSON>();

  if (tasks !== undefined && tasks !== [] && tasks !== null) {
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

          //const task = await fetch('https://gateway.pinata.cloud/ipfs/' + tasks[i])
          //ipfs.push(await task.json());
          ipfs.push(JSON.parse(task));
          solteriaArray.push(tasks[i]);
          tokenIdArray.push(i);
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

          //const task = await fetch('https://gateway.pinata.cloud/ipfs/' + tasks[i])
          //ipfs.push(await task.json());
          ipfs.push(JSON.parse(task));
          solteriaArray.push(tasks[i]);
          tokenIdArray.push(i);
        }
      }
    }
  } else {
    console.log("No task found");
  }

  return [ipfs, solteriaArray, tokenIdArray];
}

const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<JSON[]>([]);
  const [task, setTask] = useState<JSON[]>([]);
  const [tokenId, setTokenId] = useState<any>([]);

  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4";

  const {
    data: tasks,
    isSuccess,
    isLoading,
  } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "getTasks",
  });

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleContractor",
  });

  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleEmployer",
  });

  useEffect(() => {
    if (!isSuccess && isLoading) {
      setIsLoaded(false);
    } else {
      GetIPFS(tasks)
        .then(([ipfs, solteriaArray, tokenIdArray]) => {
          setData(ipfs);
          setIsLoaded(true);
          setTask(solteriaArray);
          setTokenId(tokenIdArray);
        })
        .catch((e) => {
          setIsLoaded(false);
          console.log(e);
        });
    }
  }, [tasks, isLoading, isSuccess]);

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-3 gap-8 mt-2 mx-6">
        <div className="card card-bordered bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">For Task Hunter</h2>
            <p>Claim tasks and reward</p>
            <Link href={"/tasks"}>
              <div>
                <button className="btn btn-primary mt-2">Find Tasks</button>
              </div>
            </Link>
          </div>
        </div>
        <div className="">
          {/* <Image
            src="https://i.ibb.co/N2xdQs5/Logosolteria.png"
            width="180%"
            height="170%"
            alt="logo"
            quality="100"
          /> */}
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">For Employers</h2>
            <p>Outsource work via tasks</p>
            <Link
              href={
                !isErrorEmployer && !isErrorContractor
                  ? "/onboarding"
                  : "/tasks/create"
              }
            >
              <div>
                <button className="btn btn-primary mt-2">New Task</button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid justify-items-center mb-4">
        <div className="text-2xl font-bold mt-8">Task Highlights</div>
        <br />
        {!isLoaded && (
          <div>
            {" "}
            <button
              className="btn btn-primary"
              onClick={() => {
                (window as any).location.reload();
              }}
            >
              Reload tasks
            </button>{" "}
          </div>
        )}

        {isLoaded && (
          <div>
            <div className="grid grid-cols-1 gap-4">
              <div className="carousel w-full">
                {data.map((item: any, i: number) => (
                  <div className="carousel-item active" key={i}>
                    <div
                      className="card card-compact w-96 bg-base-100 shadow-xl border-10px border-base-200 rounded-lg m-3"
                      key={i}
                    >
                      <figure>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{item.name}</h2>
                        <div>
                          <p>{item.description}</p>
                        </div>
                        <div className="badge badge-outline">
                          {item.attributes[0].value}
                        </div>
                        <div className="badge badge-outline badge-primary">
                          License:{" "}
                          {item?.attributes[1]?.value === undefined
                            ? "none"
                            : item.attributes[1].value}
                        </div>
                        <div className="badge badge-outline badge-success">
                          Reward: <GetReward tokenId={tokenId[i]} />
                        </div>
                        <div className="card-actions justify-end">
                          <button className="btn btn-outline btn-primary btn-sm">
                            <Link href={"/tasks/" + task?.[i]}>Details</Link>
                          </button>
                        </div>
                      </div>
                      <div>
                        {" "}
                        <div hidden={!isErrorContractor}>
                          <div className="card-actions justify-start">
                            {" "}
                            <DeleteTask ipfsId={task?.[i]}></DeleteTask>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
