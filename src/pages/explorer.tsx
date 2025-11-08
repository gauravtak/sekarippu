import { readDir } from "@tauri-apps/plugin-fs";
import { useState, useEffect } from "react";
import { useStore } from "../contexts/StoreContext";

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export default function Explorer() {
  const [folderPath, setFolderPath] = useState<string>("");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { store, isLoading: storeLoading } = useStore();

  useEffect(() => {
    async function loadFiles() {
      if (!store || storeLoading) return;

      try {
        const savedPath = await store.get<string>("bookFolderPath");
        if (savedPath && savedPath.trim() !== "") {
          setFolderPath(savedPath);
          const entries = await readDir(savedPath);

          const fileList: FileEntry[] = entries.map((entry) => ({
            name: entry.name || "",
            path: entry.name || "",
            isDirectory: entry.isDirectory || false,
          }));

          setFiles(fileList);
        }
      } catch (error) {
        console.error("Failed to read directory:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFiles();
  }, [store, storeLoading]);

  if (isLoading || storeLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8F5E4]">
        <p className="text-[#6E665D]">Loading...</p>
      </div>
    );
  }

  if (!folderPath) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8F5E4]">
        <p className="text-[#6E665D]">No folder path configured</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5E4] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-light text-[#2D2A26] mb-2">Explorer</h1>
          <p className="text-sm text-[#6E665D] font-light break-all">{folderPath}</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#D8C9A6] p-4 sm:p-6">
          {files.length === 0 ? (
            <p className="text-[#6E665D] text-center py-8">No files found in this directory</p>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8F5E4] transition-colors border border-transparent hover:border-[#D8C9A6]"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      file.isDirectory ? "bg-[#C1A45F]" : "bg-[#6A9A5B]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2D2A26] font-medium truncate">{file.name}</p>
                    {file.isDirectory && <p className="text-xs text-[#6E665D]">Directory</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
