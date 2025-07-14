import { getDashboardData } from "@/actions/admin";
import { Dashboard } from "./_components/dashboard";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";



export const metadata = {
  title: "Dashboard | PiyasGenDrive Admin",
  description: "Admin dashboard for PiyasGenDrive",
};

export default async function AdminDashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  );
}