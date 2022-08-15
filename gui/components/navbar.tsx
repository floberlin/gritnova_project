import Link from "next/link";
import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePrepareContractWrite,useNetwork } from "wagmi";
import Solteria from '../utils/Solteria.json'


const Navbar = () => {

  const { chain } = useNetwork()
  const contractAddr = chain?.name === 'Mumbai' ? '0x374169EdD0F686c14ED0A5074B51AF634C556909' : '0x374169EdD0F686c14ED0A5074B51AF634C556909'


  const { isError: isErrorEmployer, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'grantRoleEmployer',
  })

  const { isError: isErrorContractor, } = usePrepareContractWrite({
    addressOrName: contractAddr,
    contractInterface: Solteria.abi,
    functionName: 'grantRoleContractor',
  })



  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a href={"/"} className="btn btn-ghost text-xl font-syncopate"><div>Solteria</div></a>
        </div>
        <div className="navbar-end">
          <ConnectButton />
          
        </div>
        <Link href={!isErrorEmployer && !isErrorContractor ? "/onboarding" : "/account"}> 
        <button className="btn btn-primary btn-sm ml-2">{isErrorEmployer && isErrorContractor ? "Error" : isErrorEmployer ? "Contractor" : isErrorContractor ? "Employer" : "Account"}</button>
        </Link>
      </div>
      

    </header>
    
    
  );
};

export default Navbar;