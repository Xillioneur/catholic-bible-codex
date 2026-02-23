import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

export default function BibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center p-4 border-b bg-white sticky top-0 z-10">
          <SidebarTrigger />
          <h2 className="ml-4 font-bold text-indigo-900 uppercase tracking-tighter">Verbum Domini Codex</h2>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
