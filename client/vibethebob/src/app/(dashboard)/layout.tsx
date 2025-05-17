import { ReactNode } from "react";
import { SideNav } from "@/components/navigation/side-nav";
import { UserAuthNav } from "@/components/auth/user-auth-nav";
import { getSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen">
      <SideNav user={session.user} />
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
          <div className="flex flex-1 items-center gap-4">
            <UserAuthNav user={session.user} />
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    </div>
  );
} 