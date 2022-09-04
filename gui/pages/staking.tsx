/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Image from "next/image";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";


const Staking: NextPage = () => {
  const [stake, setStake] = useState(0);

  const { chain } = useNetwork();
  const treasuryAddr = "0x7eafFdD68326E911310C58FB3C4E09701862DbB4";
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
  });


  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <>
        <main className="min-h-screen">
          <div className="grid justify-items-center">
            
                <br />
                <div className="text-2xl font-bold mt-8">
                  Stake your earned ETH.
                </div>
                <br />
                <div className="card card-bordered w-96 bg-base-100 shadow-xl">
                  <figure>
                    <img
                      src="https://i.ibb.co/k4dR0gC/staking.png"
                      alt="solteria"
                    />
                  </figure>

                  <div className="card-body">
                    <div className="alert shadow-lg text-center">
                      <div className="font-bold">
                        <span>
                          <p>Available to Stake</p>
                          <p hidden={!isLoading}> Fetching balance… </p>
                          <p hidden={!isError}> Error fetching balance </p>
                          <p hidden={isLoading || isError}>
                            {typeof data === "undefined"
                              ? "0"
                              : Number(data?.formatted).toFixed(2)}{" "}
                            {data?.symbol}
                          </p>

                          <p className="card-actions justify-center">
                            <input
                              type="number"
                              placeholder="Enter Stake Amount"
                              className="input input-bordered input-primary w-full max-w-xs"
                              onChange={(e) =>
                                setStake(
                                  parseFloat(e.target.value) *
                                    1000000000000000000
                                )
                              }
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => {window.open("https://app.uniswap.org/#/swap?use=v1&inputCurrency=ETH&outputCurrency=0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8&chain=arbitrum")}}
                            >
                              Stake your{" "}
                              {typeof data === "undefined"
                                ? "ETH"
                                : data?.symbol}
                            </button>
                          </p>
                        </span>
                      </div>
                    </div>
                    <br />
                    <div className="alert shadow-lg link link-hover">
                      <div>
                        <Image
                          src="https://i.ibb.co/FYTHRRQ/foreign.png"
                          alt="link"
                          width="17px"
                          height="17px"
                        />
                        <span>
                          <Link href="https://rocketpool.net/">
                            Learn more about Rocket Pool.
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
             
          </div>

          {/* <><div className="toast toast-end">
          <div className="alert alert-error">
            <div>
              <span>{(prepareError || error)?.message}</span>
            </div>
          </div>
        </div></> */}
        </main>
      </>
    );
  }
};
export default Staking;
