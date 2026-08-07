import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1>Dashboard</h1>
      <UserButton />
    </div>
  );
}
