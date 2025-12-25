"use client";

import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccessDenied({ module, role }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Icon with animated pulses */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
        <div className="relative bg-red-100 p-6 rounded-full">
          <ShieldAlert className="h-16 w-16 text-red-600" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Your role as{" "}
        <span className="font-semibold text-blue-600 capitalize">{role}</span>{" "}
        does not have permission to access the{" "}
        <span className="font-semibold text-gray-900 capitalize">{module}</span>{" "}
        module standalone.
      </p>

      {/* Information Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 max-w-lg text-left">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> While you may have data visibility for this
          module in certain contexts (like picking a user for a team), the full
          management page is restricted to administrative roles to maintain
          system integrity.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/${role}`)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Button>
      </div>

      {/* Help footer */}
      <p className="mt-12 text-sm text-gray-400">
        If you believe this is an error, please contact your System
        Administrator.
      </p>
    </div>
  );
}
