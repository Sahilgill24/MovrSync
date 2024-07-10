import { Link } from "react-router-dom";
import { CopyAddress } from "@/components/ui/copy-address";
import DepositModal from "./deposit-modal";
import { useCentralStore } from "@/store/central-store";

export default function NavBar() {
  const { address } = useCentralStore();
  return (
    <>
      <header className="flex items-center justify-between bg-background pt-4 pb-1 shadow-t shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl font-display">Dashboard</span>
          </Link>
        </div>
        <div className="space-x-4">
          <CopyAddress
            className="rounded-full hover:bg-white/5"
            address={address}
          />
          <DepositModal />
        </div>
      </header>
    </>
  );
}
