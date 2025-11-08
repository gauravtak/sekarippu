import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useNavigate } from "react-router";
import { useToast } from "../contexts/ToastContext";
import { useStore } from "../contexts/StoreContext";

export default function Home() {
  const [folderPath, setFolderPath] = useState("");
  const { store, isLoading } = useStore();
  const { showToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      if (!store || isLoading) return;

      const savedPath = await store.get<string>("bookFolderPath");

      if (savedPath && savedPath.trim() !== "") {
        navigate("/explorer");
      } else {
        setFolderPath(savedPath ?? "");
      }
    }

    init();
  }, [store, isLoading, navigate]);

  const handleBrowse = async () => {
    const folder = await open({
      multiple: false,
      directory: true,
    });

    if (folder && typeof folder === "string" && store) {
      setFolderPath(folder as string);
    }
  };

  const handleSave = async () => {
    if (folderPath && store) {
      await store.set("bookFolderPath", folderPath);
      await store.save();
      showToast("✅ Your folder path has been updated");
      navigate("/explorer");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F5E4] p-4 sm:p-6 relative">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#D8C9A6] p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-2xl font-light text-[#2D2A26] mb-1">
                Add your Books folder
              </h1>
              <p className="text-xs sm:text-sm text-[#6E665D] font-light">
                Select the directory where your books are stored
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                className="outline-none flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#D8C9A6] bg-[#F8F5E4] text-[#2D2A26] placeholder:text-[#6E665D] focus:border-[#C1A45F] focus:ring-1 focus:ring-[#C1A45F] transition-colors text-sm sm:text-base"
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                name="folderPath"
                id="folderPath"
                placeholder="/path/to/books"
              />
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleBrowse}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#5C4033] text-white font-medium hover:bg-[#4A3429] active:bg-[#3D2A21] transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  Browse
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#C1A45F] text-white font-medium hover:bg-[#B0954F] active:bg-[#9F8545] transition-colors whitespace-nowrap text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
