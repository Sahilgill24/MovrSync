import NavBar from "@/components/dashboard/navbar";
import { UserData } from "@/components/dashboard/user-data";

export default function Dashboard() {
  return (
    <div className="h-screen w-[72vw] mx-auto">
      <NavBar />
      <div className="w-full flex flex-col gap-4 mt-4">
        <UserData />
      </div>
    </div>
  );
}
