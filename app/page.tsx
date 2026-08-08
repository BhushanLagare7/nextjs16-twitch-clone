import { UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1>Dashboard</h1>
      <div className="flex items-center gap-x-2">
        <UserButton />
        <ThemeToggle />
      </div>
    </div>
  );
}

