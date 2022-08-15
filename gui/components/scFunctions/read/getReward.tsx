import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'


export function GetReward({ tokenId } : { tokenId: any }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'

  const { data:reward, isLoading:isLoadingTokenId, isSuccess:isSuccessTokenId } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'tokenIDtoReward',
    args: [tokenId],
  })
  
  return (
    ( (isSuccessTokenId && (reward !== undefined)) && <div> {utils.formatEther(reward.toString())} {chain?.name === 'Mumbai' ? "ETH" : "EVMOS"}</div> ) || <div> 0 </div>
  )
}

