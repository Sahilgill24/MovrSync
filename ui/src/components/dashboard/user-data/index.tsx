import Assets from "./assets";
import Transactions from "./transactions";

export function UserData() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Assets />
      <Transactions />
    </div>
  );
}
