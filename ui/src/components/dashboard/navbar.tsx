import { Link } from "react-router-dom";

import DepositModal from "./deposit-modal";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

export default function NavBar() {
  
  return (
    <>
      <header className="flex items-center justify-between bg-background pt-4 pb-1 shadow-t shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl font-display">Dashboard</span>
          </Link>
        </div>
        <div className="space-x-4">
          
          <WalletSelector />
          <DepositModal />
        </div>
      </header>
    </>
  );
}
