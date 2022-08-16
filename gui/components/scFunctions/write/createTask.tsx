import { ethers } from 'ethers'
import { usePrepareContractWrite, useContractWrite, useNetwork,useWaitForTransaction } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function CreateTask({ipfsContent, val} : {ipfsContent: any, val: any}) {


  const ipfsId = ipfsContent;//tbd
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59' : '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59'

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
      <button className="btn btn-primary " disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Creating...' : 'Confirm'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          Task created!
          {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Mumbai Explorer</a>
          </div> */}
        </div>
          </div>
        </div>
      </div></>
      )}
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