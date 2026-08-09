import { Navbar } from "./_components/navbar";

export default function BrowseLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-20">{children}</div>
    </>
  );
}
