import { CreateTask } from "../../components/scFunctions/write/createTask";
import { useState, useEffect } from "react";
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

async function createIPFS(task: ipfsData) {
  // const config = {
  //   method: "post",
  //   url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZmFiY2NmMC1hNDI5LTRiOTItOWI3Mi1mMmQ3YjI2ZWRlNWQiLCJlbWFpbCI6Im1lQGZsby5iZXJsaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmUyNWNhOGRiODAxZDE5OWRhYTAiLCJzY29wZWRLZXlTZWNyZXQiOiIyYTRjZWRjNjA0OTQ4MjY4NDFhZDhmOWFmYTI5NTg3YjVkYTc3MDY2OTQwNTMyZTFhYThmZGNmOTdlNWUzY2M0IiwiaWF0IjoxNjYwMjEyNjQ1fQ.yg5pYYZsVczp36GeKx91vgsrVb6Msn5xMkdoPe08Js0",
  //   },
  //   data: task,
  // };

  // const res = await axios(config);
  // return res.data.IpfsHash;

  const { cid } = await nodeIPFS.add(JSON.stringify(task));
  return cid.toString();
}

function TaskDetail() {
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("0.000001");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [license, setLicense] = useState("");
  const [task, setTask] = useState<ipfsData>();
  const [ipfsHash, setIpfsHash] = useState("");

  useEffect(() => {
    const task: ipfsData = {
      name: title,
      description: description,
      attributes: [
        { trait_type: "Type", value: type },
        { trait_type: "License", value: license },
      ],
      image: "https://i.ibb.co/B6Swgn3/nft.png",
      external_url: "https://solteria.xyz",
    };
    setTask(task);
    setReward(reward);
  }, [description, title, type, reward, license]);

  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">Create New Task</div>
        <br />
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Task Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter Task Title"
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="label"></label>
          <label className="label">
            <span className="label-text">Reward Amount</span>
          </label>
          <input
            type="number"
            placeholder="Enter Reward Amount"
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={(e) => setReward(e.target.value)}
          />
          <label className="label"></label>
          <label className="label">
            <span className="label-text">Task Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-primary textarea-lg w-full max-w-xs"
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label className="label">
            <span className="label-text">Task Type</span>
          </label>
          <select
            className="select select-bordered select-primary"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled selected>
              Select Task Type
            </option>
            <option>Coding</option>
            <option>Design</option>
            <option>SEO</option>
            <option>Marketing</option>
            <option>Website</option>
            <option>Consulting</option>
          </select>
          <label className="label">
            <span className="label-text">License Requirement</span>
          </label>
          <select
            className="select select-bordered select-primary"
            onChange={(e) => setLicense(e.target.value)}
          >
            <option disabled selected>
              Select License Type Requirement
            </option>
            <option>apache-2.0</option>
            <option>cc</option>
            <option>ecl-2.0</option>
            <option>eupl-1.1</option>
            <option>gpl-2.0</option>
            <option>gpl-3.0</option>
            <option>isc</option>
            <option>mit</option>
            <option>mpl-2.0</option>
            <option>unlicense</option>
            <option>none</option>
          </select>
          <label className="label"></label>
        </div>
        <div className="indicator">
          <span className="indicator-item indicator-bottom badge badge-ghost">
            & get 1 STA
          </span>
          <label
            htmlFor="mint-modal"
            className="btn btn-primary  modal-button"
            onClick={async () =>
              setIpfsHash(await createIPFS(task as ipfsData))
            }
          >
            Mint Task NFT
          </label>
        </div>
      </div>

      <input type="checkbox" id="mint-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mint Task NFT?</h3>
          <p className="py-4">
            The following task ID will be created: {ipfsHash}
          </p>
          <div className="modal-action">
            <label htmlFor="mint-modal" className="btn">
              Close
            </label>
            {(ipfsHash === "" ? true : false) && (
              <button className="btn btn-primary" disabled={true}>
                Waiting for IPFS
              </button>
            )}
            {(ipfsHash !== "" ? true : false) && (
              <CreateTask
                ipfsContent={ipfsHash}
                val={reward}
                htmlFor={"mint-modal"}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default TaskDetail;
