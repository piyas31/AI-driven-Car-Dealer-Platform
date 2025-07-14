import { getDashboardData } from "@/actions/admin";
import { Dashboard } from "./_components/dashboard";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title: "Dashboard | PiyasGenDrive Admin",
  description: "Admin dashboard for PiyasGenDrive",
};

export default async function AdminDashboardPage() {
  const { userId } = await auth(); 

  const dashboardData = await getDashboardData(userId); 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  );
}
