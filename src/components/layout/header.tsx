import Link from 'next/link';
import { Utensils } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            PantryPal
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/favorites"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
