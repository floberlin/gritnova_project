import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function DeleteTask({ ipfsId }: { ipfsId: any }) {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "deleteTask",
    args: [ipfsId],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button className="btn btn-link btn-red btn-xs" onClick={() => write?.()}>
        {!isLoading && !isSuccess ? "Delete" : ""}
        {isLoading ? "Deleting..." : ""}
        {!isLoading && isSuccess ? "Task deleted!" : ""}
      </button>

      {isError && (
        // <><div className="toast toast-end">
        //     <div className="alert alert-error">
        <div>
          <span>{(prepareError || error)?.message}</span>
        </div>
        //   </div>
        // </div></>
      )}
    </div>
  );
}
