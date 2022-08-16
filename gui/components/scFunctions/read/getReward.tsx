import { utils } from 'ethers'
import { useContractRead, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'


export function GetReward({ tokenId } : { tokenId: any }) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59' : '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59'

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

