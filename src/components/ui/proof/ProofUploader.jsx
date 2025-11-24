// FILE: audit-frontend/src/components/ui/proof/ProofUploader.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadProofApi } from "@/services/proofService";
import { useAuthStore } from "@/stores/useAuthStore";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function ProofUploader({ fixActionId, onSuccess, onCancel }) {
  const { token } = useAuthStore();
  const {user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);
 const router = useRouter();
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, PDF, and MP4 files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caption", caption);
      formData.append("fixAction", fixActionId); // ✅ AUTO-LINKED from context

      const result = await uploadProofApi(formData, token);

      toast.success("Proof uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      onSuccess(); // Notify parent of success
      // navigate to proof
       router.push(`/dashboard/${user.role}/proofs`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload proof");
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    clearFile();
    onCancel();
  };

  return (
    <div className="space-y-4">
      {/* Context Information */}
      <div className="text-sm p-3">
        <strong >🔗 Contextual Upload</strong>
        <p className="mt-1">
          This proof will be automatically linked to the current Fix Action.
        </p>
      </div>

      {/* File Selection */}
      <div className="space-y-2">
        <Label htmlFor="proof-file">Select File *</Label>
        <div className="flex items-center gap-3">
          <Input
            id="proof-file"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
            disabled={isUploading}
            className="flex-1"
          />
          {selectedFile && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearFile}
              disabled={isUploading}
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Supported: JPEG, PNG, PDF, MP4 (Max: 100MB)
        </p>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
          <FileText className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              {selectedFile.name}
            </p>
            <p className="text-xs text-green-600">
              Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      {/* Caption Input */}
      <div className="space-y-2">
        <Label htmlFor="proof-caption">Caption (Optional)</Label>
        <Textarea
          id="proof-caption"
          placeholder="Describe what this proof shows..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isUploading}
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="min-w-[140px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Proof
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
