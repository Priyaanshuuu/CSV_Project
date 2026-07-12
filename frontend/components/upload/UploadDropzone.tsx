"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { uploadCSV } from "@/services/upload.service";
import { useUploadContext } from "@/context/uploadContext";

export default function UploadDropzone() {
  const { dispatch } = useUploadContext();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];

      if (!file.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB.");
        return;
      }

      try {
        setUploading(true);

        toast.loading("Uploading CSV...", { id: "upload" });

        const response = await uploadCSV(file);

        toast.success("CSV Parsed Successfully!", { id: "upload" });

        dispatch({
          type: "SET_PREVIEW",
          payload: { file, preview: response },
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Upload failed.",
          { id: "upload" }
        );
      } finally {
        setUploading(false);
      }
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300
        ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 hover:border-blue-500 hover:bg-slate-800"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center text-center">
        {uploading ? (
          <>
            <Loader2 size={60} className="animate-spin text-blue-500" />
            <h2 className="mt-6 text-2xl font-semibold">Uploading...</h2>
            <p className="mt-2 text-slate-400">
              Please wait while we parse your CSV.
            </p>
          </>
        ) : (
          <>
            <Upload size={60} className="text-blue-500" />
            <h2 className="mt-6 text-2xl font-semibold">
              Drag & Drop CSV Here
            </h2>
            <p className="mt-3 text-slate-400">or click to browse files</p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
              <FileSpreadsheet size={20} />
              Browse CSV
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
              <span>CSV Only</span>
              <span>•</span>
              <span>Max 10 MB</span>
              <span>•</span>
              <span>Preview Before Import</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
