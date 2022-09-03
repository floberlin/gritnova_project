// import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import type { NextPage } from "next";
import SolteriaToken from "../utils/SolteriaToken.json";

import Image from "next/image";
import { useEffect, useState } from "react";

const DAO: NextPage = () => {
  const { chain } = useNetwork();
  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"
  const treasuryAddr ="0x7eafFdD68326E911310C58FB3C4E09701862DbB4"

  const tokenAddr ="0xB48867b51c6D51f425e9d10c8c066A3471eeeF1F"
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });

  const {
    data: TreasuryBalance,
    isError: isErrorT,
    isLoading: isLoadingT,
  } = useBalance({
    addressOrName: treasuryAddr,
  });

  const { data: tBalanc } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: SolteriaToken.abi,
    functionName: "balanceOf",
    args: [contractAddr],
  });

  const { data: tBalancSelf } = useContractRead({
    addressOrName: tokenAddr,
    contractInterface: SolteriaToken.abi,
    functionName: "balanceOf",
    args: [address],
  });

  async function addToken() {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await (window as any).ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddr, // The address that the token is at.
            symbol: "STA", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: "https://i.ibb.co/nDkfFKw/Solteria-Logo-without-name.png", // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  console.log(tBalancSelf);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <main className="min-h-screen">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold mt-8">solteriaDAO</div>
          <br />
          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Treasury balance</div>
              <div hidden={!isLoadingT} className="stat-value">
                {" "}
                …{" "}
              </div>
              <div hidden={!isErrorT} className="stat-value">
                {" "}
                Error{" "}
              </div>
              <div hidden={isLoadingT || isErrorT} className="stat-value">
                {" "}
                {Number(TreasuryBalance?.formatted).toFixed(2)}{" "}
                {TreasuryBalance?.symbol}{" "}
              </div>
              <div hidden={!isLoadingT} className="stat-value">
                {" "}
                …{" "}
              </div>
              <div hidden={!isErrorT} className="stat-value">
                {" "}
                Error{" "}
              </div>
              <div hidden={isLoadingT || isErrorT} className="stat-value">
                {(Number(tBalanc?.toString()) / 1e18).toFixed(2)} STA
              </div>
              <div className="stat-actions">
                {/* <label className="btn btn-sm btn-success">
                  Staking APY: 8%
                </label> */}
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold mt-8">Your Membership</div>
          <br />
          <div className="stats bg-primary text-primary-content">
            <div className="stat">
              <div className="stat-title">Your STA balance</div>
              <div hidden={!isLoadingT} className="stat-value">
                {" "}
                …{" "}
              </div>
              <div hidden={!isErrorT} className="stat-value">
                {" "}
                Error{" "}
              </div>
              <div hidden={isLoadingT || isErrorT} className="stat-value">
                {typeof tBalancSelf === "undefined"
                  ? "0"
                  : (Number(tBalancSelf?.toString()) / 1e18).toFixed(2)}{" "}
                STA
              </div>
              <div className="stat-actions">
                {/* <label className="btn btn-sm btn-success">
                  Staking APY: 8%
                </label> */}
              </div>
              <button className="btn btn-secondary btn-xs" onClick={addToken}>
                Add Token to wallet
              </button>
            </div>
          </div>
          <div className="text-xl font-bold mt-8">Current Membership Level</div>
          <div className="btn-group btn-group-vertical">
            <div
              className="tooltip tooltip-primary tooltip-left"
              data-tip="HODL 1000 STA"
            >
              <div
                className="tooltip tooltip-primary tooltip-right"
                data-tip="fees reduced to 1.00%"
              >
                <button
                  disabled={
                    Number(tBalancSelf?.toString()) / 1e18 >= 1000
                      ? false
                      : true
                  }
                  className="btn btn-wide  btn-primary no-animation"
                >
                  Goat Solterian
                </button>
              </div>
            </div>
            <div
              className="tooltip tooltip-primary tooltip-left"
              data-tip="HODL 500 STA"
            >
              {" "}
              <div
                className="tooltip tooltip-primary tooltip-right"
                data-tip="fees reduced to 1.25%"
              >
                <button
                  disabled={
                    Number(tBalancSelf?.toString()) / 1e18 >= 500 &&
                    Number(tBalancSelf?.toString()) / 1e18 <= 1000
                      ? false
                      : true
                  }
                  className="btn btn-wide  btn-primary no-animation"
                >
                  Professional Solterian
                </button>
              </div>
            </div>
            <div
              className="tooltip tooltip-primary tooltip-left"
              data-tip="HODL 300 STA"
            >
              {" "}
              <div
                className="tooltip tooltip-primary tooltip-right"
                data-tip="fees reduced to 1.5%"
              >
                {" "}
                <button
                  disabled={
                    Number(tBalancSelf?.toString()) / 1e18 >= 300 &&
                    Number(tBalancSelf?.toString()) / 1e18 <= 500
                      ? false
                      : true
                  }
                  className="btn btn-wide  btn-primary no-animation"
                >
                  Senior Solterian
                </button>
              </div>
            </div>
            <div
              className="tooltip tooltip-primary tooltip-left"
              data-tip="HODL 100 STA"
            >
              {" "}
              <div
                className="tooltip tooltip-primary tooltip-right"
                data-tip="fees reduced to 1.75%"
              >
                {" "}
                <button
                  disabled={
                    Number(tBalancSelf?.toString()) / 1e18 >= 100 &&
                    Number(tBalancSelf?.toString()) / 1e18 <= 300
                      ? false
                      : true
                  }
                  className="btn btn-wide  btn-primary no-animation"
                >
                  Intermediate Solterian
                </button>
              </div>
            </div>
            <div
              className="tooltip tooltip-primary tooltip-left"
              data-tip="HODL 25 STA"
            >
              {" "}
              <div
                className="tooltip tooltip-primary tooltip-right"
                data-tip="fees reduced to 2%"
              >
                {" "}
                <button
                  disabled={
                    Number(tBalancSelf?.toString()) / 1e18 >= 25 &&
                    Number(tBalancSelf?.toString()) / 1e18 <= 100
                      ? false
                      : true
                  }
                  className="btn btn-wide  btn-primary no-animation"
                >
                  Junior Solterian
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default DAO;
