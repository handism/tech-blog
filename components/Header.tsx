import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="
        border-b border-border
        bg-bg
      "
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-text hover:opacity-80"
        >
          Next Tech Blog
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
