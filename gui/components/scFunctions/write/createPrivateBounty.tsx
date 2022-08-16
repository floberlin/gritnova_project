import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function CreatePrivateTask() {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59' : '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59'

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'createPrivateTask',
  })
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div>
      <button className="btn btn-primary" onClick={() => write?.()}>Revoke Employer</button>
    </div>
  )
}