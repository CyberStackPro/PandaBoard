import React from "react";
import DashboardPage from "./page";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { NavActions } from "../_components/sidebar/nav-actions";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="relative flex-1 overflow-auto p-4">
            <Header />
            {children}
          </main>
          <SidebarTrigger />
        </div>
      </div>
    </SidebarProvider>
  );
};

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                Project Management & Task Tracking
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  );
}
export default DashboardLayout;

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   // const [isCollapsed, setIsCollapsed] = useState(false);
//   return (
//     <SidebarProvider>
//       <div className="overflow-y-hidden w-full overflow-hidden">
//         <ResizablePanelGroup direction="horizontal">
//           <ResizablePanel
//             defaultSize={0}
//             // minSize={15}
//             maxSize={30}
//             className="border-r"
//           >
//             <AppSidebar />
//           </ResizablePanel>
//           <ResizableHandle withHandle />
//           <ResizablePanel defaultSize={80}>
//             <div className="flex h-full flex-col">
//               <Header />
//               <main className="flex-1 overflow-auto p-6">{children}</main>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//         <SidebarTrigger />
//       </div>
//     </SidebarProvider>
//   );
// };
