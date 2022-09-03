import { utils } from "ethers";
import { useContractRead, useNetwork } from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function GetReward({
  tokenId,
}: {
  tokenId: string | string[] | undefined;
}) {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const {
    data: reward,
    isLoading: isLoadingTokenId,
    isSuccess: isSuccessTokenId,
  } = useContractRead({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "tokenIDtoReward",
    args: [tokenId],
  });

  return (
    (isSuccessTokenId && reward !== undefined && (
      <div>
        {" "}
        {utils.formatEther(reward.toString())}{" "}
        ETH
      </div>
    )) || <div> 0 </div>
  );
}
