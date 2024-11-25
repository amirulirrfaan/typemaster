import { KeyboardIcon, LineChartIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <KeyboardIcon className="h-6 w-6" />
          <span className="font-bold text-xl">TypeMaster </span>{" "}
          <span className="text-xs">by Irfan ✌🏼 </span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/stats"
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <LineChartIcon className="h-5 w-5" />
            <span>Stats</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
