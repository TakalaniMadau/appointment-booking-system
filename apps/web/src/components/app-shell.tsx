import { Outlet } from "react-router-dom";

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-app px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <main className="py-2 sm:py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
