import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type PropsWithChildren } from "react";
import { useSessionStore, type SessionState } from "@/stores";

export function SessionLayout({ children }: PropsWithChildren) {
  const session = useSessionStore((state) => state);

  return (
    <div className="flex h-screen flex-col w-screen overflow-hidden bg-gray-100">
      <header className="flex w-full min-h-fit shrink-0 bg-background items-center px-12 py-4 justify-center">
        <Tabs
          value={session.session ?? "patient"}
          onValueChange={(value) =>
            session.changeSession(value as NonNullable<SessionState["session"]>)
          }
        >
          <TabsList className="bg-transparent">
            <TabsTrigger value="patient">Pacientes</TabsTrigger>
            <TabsTrigger value="doctor">Médicos</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="flex size-full overflow-hidden">
        {children ?? <Outlet />}
      </main>

      <Toaster />
    </div>
  );
}
