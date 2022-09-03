import Router from "next/router";
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import type { NextPage } from "next";
import Solteria from "../utils/Solteria.json";
import { GrantRoleEmployer } from "../components/scFunctions/write/grantRoleEmployer";
import { GrantRoleContractor } from "../components/scFunctions/write/grantRoleContractor";
import { usePrepareContractWrite, useNetwork } from "wagmi";

const Onboarding: NextPage = () => {
  const { chain } = useNetwork();

  const contractAddr = "0x048e3eB0eD956a6E09Fc7ffB79E648F8353B1CC4"

  const { isConnected } = useAccount();

  const { isError: isErrorContractor } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: "grantRoleContractor",
  });

  useEffect(() => {
    if (isErrorContractor) {
      setTimeout(() => {
        Router.push("/tasks");
      }, 100);
    }
  }, [isErrorContractor]);

  return (
    <main className="min-h-screen">
      <div className="grid justify-items-center">
        <div className="text-2xl font-bold mt-8">Hello Fren 👋</div>
        <div className="text-2xl mt-4">To get started:</div>
        <div className="text-2xl mt-2">1. Connect your wallet</div>
        <div className="text-2xl mt-2 mb-8">
          2. Let us know how you want to participate
        </div>

        {isConnected ? (
          <></>
        ) : (
          <ConnectButton
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            chainStatus="icon"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        )}

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Employer</h2>
              <p>Choose this role if you want to outsource work via tasks</p>
              <div className="card-actions justify-center">
                <GrantRoleEmployer />
              </div>
            </div>
          </div>

          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Contractor</h2>
              <p>Choose this role to claim tasks and rewards</p>
              <div className="card-actions justify-center">
                <GrantRoleContractor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Onboarding;
