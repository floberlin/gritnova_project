import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function RevokeRoleContractor() {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "revokeRoleContractor",
  });

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleContractor",
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button
        className="btn btn-primary my-8 "
        disabled={!write || isLoading || isErrorContractor}
        onClick={() => write?.()}
      >
        {isLoading ? "Revoking Status..." : "Revoke Contractor Status"}
      </button>
      {isSuccess && (
        <>
          <div className="toast toast-end">
            <div className="alert alert-success">
              <div>
                <div>
                  Status revoked
                  {/* <div>
            <a href={`https://evm.ETH.dev/tx/${data?.hash}`}>ETH Explorer</a>
          </div> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isError && (
        <>
          <div className="toast toast-end">
            <div className="alert alert-error">
              <div>
                <span>{(prepareError || error)?.message}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
