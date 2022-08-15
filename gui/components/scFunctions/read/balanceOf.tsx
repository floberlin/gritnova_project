import { useContractRead, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function BalanceOf(account:string, tokenId:BigInt) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'

  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'balanceOf',
    args: [account, tokenId],
  })
  
  return data;
}