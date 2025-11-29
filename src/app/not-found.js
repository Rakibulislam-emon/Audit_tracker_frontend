import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-500">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
