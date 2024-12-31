import React from "react";
import DashboardPage from "./page";
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
import { CoverImage } from "../_components/editor/CoverImage";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="relative flex-1 overflow-auto p-4 mx-auto h-24  w-full max-w-5xl rounded-xl ">
              {children}
            </main>
            <SidebarTrigger />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export function Header() {
  return (
    <header className="flex flex-col shrink-0">
      <CoverImage />
      <div className="relative h-[200px] w-full bg-gradient-to-r from-primary/10 to-primary/5">
        {/* Optional: Add cover image upload button */}
        <button className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-1 text-sm hover:bg-background">
          Add cover
        </button>
      </div>

      {/* Title and Actions Bar */}
      <div className="flex h-14 items-center gap-2 px-4 border-b">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            {/* Page Icon */}
            <button className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center">
              📄
            </button>
            {/* Page Title */}
            <h1 className="text-xl font-medium">Untitled</h1>
          </div>
        </div>
        <div className="ml-auto">
          <NavActions />
        </div>
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
