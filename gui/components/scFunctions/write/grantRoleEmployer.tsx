import { Address } from 'cluster';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'




export function GrantRoleEmployer() {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59' : '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59'

  const { config, error: prepareError, isError: isPrepareError, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'grantRoleEmployer',
  })

  const { isError: isErrorContractor, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'grantRoleContractor',
  })
  
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <div>
      <button className="btn btn-primary my-8 " disabled={!write || isLoading || isErrorContractor} onClick={() => write?.()}>
        {isLoading ? 'Setting Status...' : 'Become Employer'}
      </button>
      {isSuccess && (
        <><div className="toast toast-end">
        <div className="alert alert-success">
          <div>
          <div>
          You are now an Employer
          {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Mumbai Explorer</a>
          </div> */}
        </div>
          </div>
        </div>
      </div></>
      )}
      {(isError) && (
        
      <><div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div></>
        
          
      )}
    </div>
  )
}