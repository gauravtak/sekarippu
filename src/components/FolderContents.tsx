import { FaFolder, FaFile } from "react-icons/fa";

export interface ContentMetadata {
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  name: string;
}

interface FolderContentsProps {
  content: ContentMetadata[];
  onDirClick: (name: string) => void;
  onFileClick: (name: string) => void;
}

export default function FolderContents({ content, onDirClick, onFileClick }: FolderContentsProps) {
  if (content.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#D8C9A6] p-8 sm:p-12 text-center">
        <p className="text-[#6E665D] font-light text-sm sm:text-base">
          No content found in this directory
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {content.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-[#D8C9A6] p-4 sm:p-6 hover:shadow-md hover:border-[#C1A45F] transition-all duration-200 cursor-pointer group"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            {item.isDirectory ? (
              <div onClick={() => onDirClick(item.name)}>
                <FaFolder
                  className="text-4xl sm:text-5xl md:text-6xl text-[#C1A45F] group-hover:text-[#B0954F] transition-colors"
                  aria-label="Directory"
                />
              </div>
            ) : (
              <div onClick={() => onFileClick(item.name)}>
                <FaFile
                  className="text-4xl sm:text-5xl md:text-6xl text-[#6E665D] group-hover:text-[#5C4033] transition-colors"
                  aria-label="File"
                />
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#2D2A26] text-center font-light break-words w-full line-clamp-2">
              {item.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
