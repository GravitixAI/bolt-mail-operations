import { Sidebar } from "@/components/sidebar";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Sidebar />
      <main className="md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

