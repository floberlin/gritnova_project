import {
  usePrepareContractWrite,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from "wagmi";
import Solteria from "../../../utils/Solteria.json";
import SolteriaToken from "../../../utils/SolteriaToken.json";

export function ClaimFunds({ ipfsId }: { ipfsId: any }) {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "claimFunds",
    args: [ipfsId],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const tokenAddr ="0xB48867b51c6D51f425e9d10c8c066A3471eeeF1F"

  const { address } = useAccount();

  const { data: tBalancSelf } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: SolteriaToken.abi,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <div>
      <div
        className="tooltip tooltip-primary tooltip-left"
        data-tip={
          Number(tBalancSelf?.toString()) / 1e18 >= 1000
            ? "1% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 500 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 1000
            ? "1.25% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 300 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 500
            ? "1.5% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 100 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 300
            ? "1.75% withdraw fee"
            : Number(tBalancSelf?.toString()) / 1e18 >= 25 &&
              Number(tBalancSelf?.toString()) / 1e18 <= 100
            ? "2% withdraw fee"
            : "2.5% withdraw fee"
        }
      >
        <button
          className="btn btn-primary "
          disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Claiming..." : "Claim Rewards"}
        </button>
      </div>
      {isSuccess && (
        <>
          <div className="toast toast-end">
            <div className="alert alert-success">
              <div>
                <div>
                  Rewards claimed!
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
