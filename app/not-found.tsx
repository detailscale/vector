import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark font-outfit">
      <div className="text-center space-y-5">
        <div className="space-y-2">
          <h1 className="text-6xl font-light text-muted-foreground">404</h1>
          <h2 className="text-xl font-medium">Page not found</h2>
          <p className="text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Button asChild>
          <Link href="/">
            <Undo2 className="mb-0.5" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
