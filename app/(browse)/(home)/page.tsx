import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex justify-center gap-4 p-4">
      <h1>Home Page</h1>
      <ThemeToggle />
    </div>
  );
}
