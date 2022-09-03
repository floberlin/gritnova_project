import { usePrepareContractWrite, useContractWrite, useNetwork } from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function CreatePrivateTask() {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "createPrivateTask",
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => write?.()}>
        Revoke Employer
      </button>
    </div>
  );
}
