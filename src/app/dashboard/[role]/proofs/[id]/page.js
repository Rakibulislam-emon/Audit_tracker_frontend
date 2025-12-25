"use client";

import UniversalDetailView from "@/components/ui/dynamic/UniversalDetailView";
import { useParams } from "next/navigation";
import { useModuleDataById } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ProofDetailPage() {
  const params = useParams();
  const { id } = params;
  const { token } = useAuthStore();

  // Fetch proof data to show image
  const { data: proof } = useModuleDataById("proofs", token, id);

  return (
    <div>
      {/* Compact Image Preview Section */}
      {proof && proof.cloudinaryUrl && proof.fileType === "image" && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center bg-muted/30 p-3 rounded-lg border border-border">
                <Image
                  src={proof.cloudinaryUrl}
                  alt={proof.originalName || "Proof image"}
                  width={400}
                  height={300}
                  className="rounded shadow-sm"
                  style={{ objectFit: "contain", maxHeight: "300px" }}
                />
              </div>
              {proof.caption && (
                <p className="text-xs text-muted-foreground mt-3 px-2 italic">
                  {proof.caption}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Standard Detail View */}
      <UniversalDetailView module="proofs" />
    </div>
  );
}
