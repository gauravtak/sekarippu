import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { pdfjs, Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { readFile } from "@tauri-apps/plugin-fs";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PdfViewer = () => {
  const { pdfPath } = useParams();
  const navigate = useNavigate();
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [scaleValue, setScaleValue] = useState(1);
  const decodedPath = decodeURIComponent(String(pdfPath));

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    async function loadPdf() {
      const bytes = await readFile(decodedPath ?? "");
      setPdfData(bytes);
    }
    loadPdf();
  }, [pdfPath]);

  useEffect(() => {
    function handleKeyDown(e: any) {
      // Detect Ctrl + =
      if (e.ctrlKey && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn(); // <-- your zoom function
      }

      // Optional: Ctrl + - for zoom out
      if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function zoomIn() {
    setScaleValue((prevScale) => prevScale + 0.1);
  }

  function zoomOut() {
    setScaleValue((prevScale) => prevScale - 0.1);
  }

  const fileObject = useMemo(() => (pdfData ? { data: pdfData } : null), [pdfData]);

  if (!fileObject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-6">
      <div className="flex gap-10 justify-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5C4033] text-white hover:bg-[#4A3429] active:bg-[#3D2A21] transition-colors"
        >
          <FaArrowLeft />
        </button>

        <div className="flex flex-col items-center">
          <Document file={fileObject} scale={scaleValue} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>

        <div>
          <p>
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <div className="flex gap-4 justify-center">
            <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
              Prev
            </button>
            <button
              type="button"
              disabled={numPages ? pageNumber >= numPages : true}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
