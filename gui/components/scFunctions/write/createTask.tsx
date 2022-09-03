import { ethers } from 'ethers'
import { usePrepareContractWrite, useContractWrite, useNetwork,useWaitForTransaction } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function CreateTask({ipfsContent, val, htmlFor} : {ipfsContent: string, val: string, htmlFor: string}) {


  const ipfsId = ipfsContent;
  const { chain } = useNetwork()
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'createTask',
    args: [ipfsId],
    overrides: {
      value: ethers.utils.parseEther(val),
    },
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  return (
    <div>
      <button className={!isSuccess ? "btn btn-primary" : "btn btn-success"} disabled={!write || isLoading || isSuccess} onClick={() => write?.()}>
      {(!isLoading && !isSuccess) ? 'Confirm' : ''}
        {(isLoading ) ? 'Creating...' : ''}
        {(!isLoading && isSuccess) ? 'Task created!' : ''}
      </button>
      
      {(isError) && (
        
      // <><div className="toast toast-end">
      //     <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
        //   </div>
        // </div></>
        
          
      )}
    </div>
  )
}