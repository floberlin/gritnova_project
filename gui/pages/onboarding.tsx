// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractWrite } from "wagmi";
import type { NextPage } from 'next';
import Solteria from '../utils/Solteria.json';
import { GrantRoleEmployer } from '../components/scFunctions/write/grantRoleEmployer';
import { GrantRoleContractor } from '../components/scFunctions/write/grantRoleContractor';

const Onboarding: NextPage = () => {

  return (
    <main className="min-h-screen">
        <div className="grid justify-items-center">
            <div className="text-2xl font-bold mt-8">Onboarding 👋</div>
            <div className="text-2xl mt-4">Select your Role:</div>
            <div> <GrantRoleEmployer /></div>
            <div><GrantRoleContractor /></div>
  
      
    
        </div>    
    </main>
  );
};

export default Onboarding;
