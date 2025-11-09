import { useState, useEffect } from "react";
import { useStore } from "../contexts/StoreContext";
import { readDirectory } from "../utilities/readDirectory";
import { useNavigate, useParams } from "react-router";
import FolderContents, { ContentMetadata } from "../components/FolderContents";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";

export default function Explorer() {
  const navigate = useNavigate();
  const { folderPath } = useParams<{ folderPath?: string }>();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [rootPath, setRootPath] = useState<string>("");
  const [content, setContent] = useState<ContentMetadata[]>([]);
  const { store } = useStore();

  useEffect(() => {
    async function loadPath() {
      if (store) {
        const basePath = await store.get<string>("bookFolderPath");
        // Normalize root path (remove trailing slashes)
        const root = basePath ? basePath.replace(/\/+$/, "") : "";
        setRootPath(root);

        // If there's a folderPath param, decode it and use it
        // Otherwise use the root path
        let pathToLoad = root;
        if (folderPath) {
          try {
            // Decode the path from URL
            const decodedPath = decodeURIComponent(folderPath);
            pathToLoad = decodedPath;
          } catch (error) {
            console.error("Error decoding path:", error);
            pathToLoad = root;
          }
        }

        // Normalize the path (remove trailing slashes)
        pathToLoad = pathToLoad.replace(/\/+$/, "");
        setCurrentPath(pathToLoad);

        if (pathToLoad) {
          try {
            const result = await readDirectory(pathToLoad);
            setContent(result);
          } catch (error) {
            console.error("Error reading directory:", error);
            setContent([]);
          }
        } else {
          setContent([]);
        }
      }
    }

    loadPath();
  }, [store, folderPath]);

  const handleDirClick = (name: string) => {
    // Construct the new path
    const newPath = currentPath ? `${currentPath}/${name}` : name;
    // Encode the path for URL
    const encodedPath = encodeURIComponent(newPath);
    // Navigate to the new path
    navigate(`/explorer/${encodedPath}`);
  };

  const handleFileClick = (name: string) => {
    console.log("File clicked:", name);
    // TODO: Handle file click (e.g., open file, show preview, etc.)
  };

  const handleBackClick = () => {
    // Normalize paths for comparison
    const normalizedCurrent = currentPath.replace(/\/+$/, "");
    const normalizedRoot = rootPath.replace(/\/+$/, "");

    if (!normalizedCurrent || normalizedCurrent === normalizedRoot) {
      // Already at root, navigate to explorer index
      navigate("/explorer");
      return;
    }

    // Get parent directory by removing the last segment
    const pathParts = normalizedCurrent.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      pathParts.pop(); // Remove last segment

      // Reconstruct path with leading slash if it's an absolute path
      const parentPath =
        pathParts.length > 0
          ? (normalizedCurrent.startsWith("/") ? "/" : "") + pathParts.join("/")
          : normalizedRoot;

      const normalizedParent = parentPath.replace(/\/+$/, "");

      // If parent is root, navigate to explorer index
      if (normalizedParent === normalizedRoot || normalizedParent === "") {
        navigate("/explorer");
      } else {
        const encodedPath = encodeURIComponent(normalizedParent);
        navigate(`/explorer/${encodedPath}`);
      }
    } else {
      navigate("/explorer");
    }
  };

  // Generate breadcrumb paths
  const getBreadcrumbs = () => {
    if (!currentPath || currentPath === rootPath) {
      return [{ name: "Root", path: rootPath }];
    }

    const pathParts = currentPath.split("/").filter(Boolean);
    const rootParts = rootPath.split("/").filter(Boolean);

    // Remove root parts from the beginning
    const relativeParts = pathParts.slice(rootParts.length);

    const breadcrumbs = [{ name: "Root", path: rootPath }];

    let currentBreadcrumbPath = rootPath;
    relativeParts.forEach((part) => {
      currentBreadcrumbPath = currentBreadcrumbPath ? `${currentBreadcrumbPath}/${part}` : part;
      breadcrumbs.push({ name: part, path: currentBreadcrumbPath });
    });

    return breadcrumbs;
  };

  const handleBreadcrumbClick = (path: string) => {
    if (path === rootPath) {
      navigate("/explorer");
    } else {
      const encodedPath = encodeURIComponent(path);
      navigate(`/explorer/${encodedPath}`);
    }
  };

  const isAtRoot = !currentPath || currentPath === rootPath;
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#F8F5E4] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#D8C9A6] p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {!isAtRoot && (
              <button
                onClick={handleBackClick}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5C4033] text-white hover:bg-[#4A3429] active:bg-[#3D2A21] transition-colors"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-sm" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-[#2D2A26]">Explorer</h1>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <FaChevronRight className="text-xs text-[#6E665D]" />}
                <button
                  onClick={() => handleBreadcrumbClick(crumb.path)}
                  className={`text-xs sm:text-sm font-light transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-[#2D2A26] cursor-default"
                      : "text-[#6E665D] hover:text-[#C1A45F] cursor-pointer"
                  }`}
                  disabled={index === breadcrumbs.length - 1}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          {/* Full Path Display */}
          <p className="text-xs sm:text-sm text-[#6E665D] font-light break-all mt-2">
            {currentPath || "No path selected"}
          </p>
        </div>

        {/* Content Grid */}
        <FolderContents
          content={content}
          onDirClick={handleDirClick}
          onFileClick={handleFileClick}
        />
      </div>
    </div>
  );
}
