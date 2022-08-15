import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function CreatePrivateTask() {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'

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