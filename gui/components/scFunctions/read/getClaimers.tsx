import { useContractRead, useNetwork } from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function GetClaimers(ipfsId: string | string[] | undefined) {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const { data, isLoading, isSuccess } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "getClaimers",
    args: [ipfsId],
  });

  return data;
}
