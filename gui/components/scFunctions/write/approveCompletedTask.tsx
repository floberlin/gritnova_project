import { usePrepareContractWrite, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function ApproveCompletedTask({ipfsId, claimer} : {ipfsId: any, claimer: string}) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'approveCompletedTask',
    args: [ipfsId, claimer],
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })


  return (
    <div>
      <button className="btn btn-primary " disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Approving...' : 'Approve'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          Task approved!
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