/* eslint-disable @next/next/no-img-element */
import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ApproveCompletedTask } from "../../components/scFunctions/write/approveCompletedTask";
import { ClaimTask } from "../../components/scFunctions/write/claimTask";
import { ClaimFunds } from "../../components/scFunctions/write/claimFunds";
import { GetStatus } from "../../components/scFunctions/read/getStatus";
import { GetClaimers } from "../../components/scFunctions/read/getClaimers";
import { CompleteTask } from "../../components/scFunctions/write/completeTask";
import { GetReward } from "../../components/scFunctions/read/getReward";
import { GetTokenID } from "../../components/scFunctions/read/getTokenID";
import Solteria from "../../utils/Solteria.json";
import { useAccount, useNetwork, usePrepareContractWrite } from "wagmi";

import storage from "../../utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link";

import { create } from "ipfs-http-client";

const nodeIPFS = create({
  host: "magentadao-backend.westeurope.cloudapp.azure.com",
  port: 443,
  protocol: "https",
});

interface ipfsData {
  name: string;
  description: string;
  attributes: [
    { trait_type: string; value: string },
    { trait_type: string; value: string }
  ];
  image: string;
  external_url: string;
}

async function GetIPFS(ipfsId: any) {
  // const task = await fetch("https://gateway.pinata.cloud/ipfs/" + ipfsId);
  // return task.json();

  try {
    const source = nodeIPFS.cat(ipfsId);
    const data = [];
    for await (const chunk of source) {
      data.push(chunk);
    }
    const byteArray = data.toString().split(",");
    var task = "";
    for (let j = 0; j < byteArray.length; j++) {
      task += String.fromCharCode(Number(byteArray[j]));
    }
    return JSON.parse(task);
  } catch (error) {
    console.log(error);
    const source = nodeIPFS.cat(ipfsId);
    const data = [];
    for await (const chunk of source) {
      data.push(chunk);
    }
    const byteArray = data.toString().split(",");
    var task = "";
    for (let j = 0; j < byteArray.length; j++) {
      task += String.fromCharCode(Number(byteArray[j]));
    }
  }

  return JSON.parse(task);
}

function TaskDetail() {
  const { address } = useAccount();

  // State to store uploaded file
  const [file, setFile] = useState("");

  // progress
  const [percent, setPercent] = useState(0);

  // Handle file upload event and update state
  function handleChange(event: {
    target: { files: SetStateAction<string>[] };
  }) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload a txt file first!");
    }

    const storageRef = ref(storage, `/files/${ipfsId}${address}.txt`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {});
      }
    );
  };

  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4";

  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleEmployer",
  });

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
        console.log(e);
      });
  }, [ipfsId, claimers]);

  const { isError: isPrepareError } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "claimTask",
    args: [ipfsId],
  });

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
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
          <div className="text-2xl font-bold mt-8">Task Details</div>
          {!isLoaded && (
            <button
              className="btn btn-primary"
              onClick={() => {
                (window as any).location.reload();
              }}
            >
              Reload tasks
            </button>
          )}

          {isLoaded && data && (
            <div className="grid justify-items-center grid-cols-1 gap-4 mt-2">
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Rewards</div>
                  <div className="stat-value">
                    <GetReward tokenId={tokenId} />
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Type</div>
                  <div className="stat-value">{data.attributes[0].value}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">License</div>
                  <div className="stat-value">
                    {data?.attributes[1]?.value === undefined
                      ? "none"
                      : data.attributes[1].value}
                  </div>
                </div>
              </div>
              <div className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  <img src={data.image} alt="Task" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{data.name}</h2>
                  {data.description}
                  <div className="card-actions justify-end">
                  <ClaimTask ipfsId={ipfsId} />
                  </div>
                </div>
              </div>

              <p>Status: {status ? "Done" : "Open for Claimers"}</p>

              <p>ERC-1155 Token ID: {tokenId}</p>
              

              <button
                disabled={!isErrorEmployer || !isPrepareError}
                className="btn btn-primary modal-button"
              >
                {" "}
                <label htmlFor="my-modal">Submit work</label>{" "}
              </button>
              <input type="checkbox" id="my-modal" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box grid justify-items-center">
                  <label
                    htmlFor="my-modal"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>
                  <div>
                    {" "}
                    <input
                      className="center w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yellow-50 file:text-yellow-700
                      hover:file:bg-yellow-100 "
                      type="file"
                      onChange={handleChange}
                      accept="/*"
                    />{" "}
                  </div>
                  <br />
                  <button className="btn btn-primary" onClick={handleUpload}>
                    Upload your work
                  </button>
                  <br />
                  <progress
                    className="progress progress-primary w-56"
                    value={percent}
                    max="100"
                  ></progress>
                  <div hidden={!(percent === 100)} className="text-center">
                    {" "}
                    Work uploaded!
                  </div>
                </div>
              </div>

              <CompleteTask ipfsId={ipfsId} />
              <ClaimFunds ipfsId={ipfsId} />

              <div className="text-2xl font-bold mt-8">Claims History</div>
              {claimers?.map((claimer) => (
                <div
                  className="grid justify-items-center grid-cols-1 gap-4"
                  key={claimer}
                >
                  <Link
                    href={`https://firebasestorage.googleapis.com/v0/b/solteria-b7f21.appspot.com/o/files%2F${ipfsId}${claimer}.txt?alt=media&token=bbeac4fc-5c48-472e-b3be-b68e45d255da`}
                  >
                    <p className="link">
                      {" "}
                      Claimer: {claimer}{" "}
                      <Image
                        src="https://i.ibb.co/FYTHRRQ/foreign.png"
                        alt="link"
                        width="17px"
                        height="17px"
                      />
                    </p>
                  </Link>
                  <ApproveCompletedTask ipfsId={ipfsId} claimer={claimer} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }
}

export default TaskDetail;
