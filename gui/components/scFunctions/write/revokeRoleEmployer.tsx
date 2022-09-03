import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import Solteria from "../../../utils/Solteria.json";

export function RevokeRoleEmployer() {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "revokeRoleEmployer",
  });

  const { isError: isErrorEmployer } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleEmployer",
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <button
        className="btn btn-primary my-8 "
        disabled={!write || isLoading || isErrorEmployer}
        onClick={() => write?.()}
      >
        {isLoading ? "Revoking Status..." : "Revoke Employer Status"}
      </button>
      {isSuccess && (
        <>
          <div className="toast toast-end">
            <div className="alert alert-success">
              <div>
                <div>
                  Status revoked
                  {/* <div>
            <a href={`https://evm.evmos.dev/tx/${data?.hash}`}>Evmos Explorer</a>
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
