import { useContractRead, useNetwork } from 'wagmi'
import Solteria from '../../../utils/Solteria.json'

export function GetTokenID(ipfsId: any) {
  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59' : '0xEA93a92d663BF9eeD87797087aEd3D6EE9e0eb59'

  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'getTokenID',
    args: [ipfsId],
  })
  
  if (isSuccess) {
    const tokenId = data?.toString();
    return tokenId;
  }
}