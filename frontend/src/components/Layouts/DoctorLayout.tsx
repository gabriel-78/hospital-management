import { Toaster } from "@/components/ui/sonner";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PropsWithChildren } from "react";
import { useSessionStore } from "@/stores";

export function DoctorLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();

  const session = useSessionStore((state) => state);

  const currentTab =
    location.pathname === "/"
      ? "consultations"
      : location.pathname.split("/").pop() || "home";

  return (
    <div className="flex h-screen flex-col w-screen overflow-hidden bg-gray-100">
      <header className="flex w-full min-h-fit shrink-0 bg-background items-center px-12 py-4 justify-between">
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            navigate(value === "consultations" ? "/" : `/${value}`)
          }
        >
          <TabsList className="bg-transparent">
            <TabsTrigger value="consultations">Agenda de Consultas</TabsTrigger>

            <TabsTrigger value="history">Histórico de Consultas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-[6.25rem] flex justify-end">
          <button
            className="flex items-center justify-center shrink-0 size-9 bg-gray-300 text-gray-800 text-sm rounded-full"
            onClick={() => session.cleanDoctor()}
          >
            <span>TS</span>
          </button>
        </div>
      </header>

      <main className="flex size-full overflow-hidden">
        {children ?? <Outlet />}
      </main>

      <Toaster />
    </div>
  );
}
