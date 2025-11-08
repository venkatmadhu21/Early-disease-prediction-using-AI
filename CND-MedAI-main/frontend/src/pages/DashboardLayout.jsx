import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import ErrorBoundary from "../components/ErrorBoundary";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default DashboardLayout;