/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import { useContractRead, useNetwork, useProvider } from 'wagmi'
import Solteria from '../../utils/Solteria.json'
import { useEffect, useState } from 'react';
import { Result } from "ethers/lib/utils";
import { GetReward } from "../../components/scFunctions/read/getReward";



async function GetIPFS(tasks: string | Result | undefined) {
  
  let ipfs = new Array<JSON>;
  if (tasks !== undefined) {
      for (let i = 10; i < tasks.length; i++) { // 10 is the index of the first task for testing purposes
        const task = await fetch('https://gateway.pinata.cloud/ipfs/' + tasks[i])
        ipfs.push(await task.json());
    }
    }
  
  return ipfs;  

  }
  
function TaskOverview() {

 const [isLoaded, setIsLoaded] = useState(false);
 const [data, setData] = useState<JSON[]>([]);

 const { chain } = useNetwork()
 const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'



  const { data:tasks, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'getTasks',
  })

  console.log(tasks)


  useEffect(() => {
    if (!isSuccess ) {
       setIsLoaded(false);
     } 
    GetIPFS(tasks)
      .then((res:JSON[]) => {
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

<Link href={"/tasks/create"}><button className="btn btn-primary my-8">New Task</button></Link>

<div className="text-2xl font-bold mt-8">Task Overview</div>
<br/>
{!isLoaded  && <p>loading tasks...</p>}

{isLoaded && (
  <div className="grid grid-cols-1 gap-4">
    {data.map((item:any, i:number ) => (
<div
className="card card-compact w-96 bg-base-100 shadow-xl border-10px border-base-200 rounded-lg" 
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
<div className="badge badge-outline badge-success">Reward: <GetReward tokenId={i+10} /></div> 
<div className="card-actions justify-end">


<Link className="btn btn-primary my-8" href={"/tasks/"+tasks?.[i+10]}>Details</Link>
</div>
</div>
</div>
)
)}
  </div>
)}


</div>
            
   </main>
  );

}

export default TaskOverview;
