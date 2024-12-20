import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/sidebar/app-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="h-screen w-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="border-r"
          >
            <AppSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="flex h-full flex-col">
              <Header />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <SidebarTrigger />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

function Header() {
  return (
    <header className="border-b px-6 py-3">
      <nav>
        <ul className="flex items-center space-x-6">
          <li className="text-sm hover:text-primary">Home</li>
          <li className="text-sm hover:text-primary">Documents</li>
          <li className="text-sm hover:text-primary">Settings</li>
          <li className="text-sm hover:text-primary">Trash</li>
          <li className="text-sm hover:text-primary">Help</li>
        </ul>
      </nav>
    </header>
  );
}
