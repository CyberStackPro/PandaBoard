import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
        <div className="flex flex-1 flex-col min-w-0">
          <Header />

          <div className="relative w-full bg-gradient-to-r from-primary/10 to-primary/5 h-[200px]">
            {/* Cover Image Section */}
            <button className="absolute bottom-3 right-3 rounded-md bg-background/80 px-3 py-1 text-sm hover:bg-background">
              Add cover
            </button>
          </div>

          <SidebarInset>
            <main className="relative flex-1 overflow-auto p-6 mx-auto w-full max-w-5xl">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center bg-background shadow-sm">
      <div className="px-4 pt-3">
        {/* Breadcrumb Section */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
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
      </div>
      <div className="ml-auto px-4">
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
