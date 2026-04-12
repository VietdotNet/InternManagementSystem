import { InternSidebar } from "./InternSidebar";

export function InternLayout({ children }) {
  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      <InternSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
